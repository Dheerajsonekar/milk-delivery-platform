import { Request, Response } from "express";
import mongoose from "mongoose";
import { openai } from "../utils/openai";
import Product, { IProduct } from "../models/Product";

// Cosine similarity helper
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

//Generate embeddings for all products
export const generateEmbeddings = async (_req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find();

    for (const product of products) {
      const text = `${product.name}. ${product.description}`;
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });

      product.embedding = response.data[0].embedding;
      await product.save();
    }

    res.json({ message: "Embeddings generated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate embeddings" });
  }
};

// Get recommendations for a specific product
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const targetProduct = await Product.findById(productId);
    if (!targetProduct || !targetProduct.embedding?.length) {
      return res.status(404).json({ error: "Product or embedding not found" });
    }

    const otherProducts: IProduct[] = await Product.find({
      _id: { $ne: productId },
    });

    const recommendations: IProduct[] = otherProducts
      .map((p: IProduct) => ({
        product: p,
        score: cosineSimilarity(targetProduct.embedding!, p.embedding || []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => r.product);

    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
