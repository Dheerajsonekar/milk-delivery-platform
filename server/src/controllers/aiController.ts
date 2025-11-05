import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import Product, { IProduct } from "../models/Product";

const JINA_API_URL = "https://api.jina.ai/v1/embeddings";
const JINA_MODEL = "jina-embeddings-v3";

// --- Cosine similarity helper ---
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// --- Generate embedding for a product if missing ---
const ensureEmbedding = async (productDoc: any): Promise<typeof productDoc> => {
  if (productDoc.embedding && productDoc.embedding.length > 0) return productDoc;

  const text = `${productDoc.name}. ${productDoc.description}. Category: ${productDoc.category || ""}`;

  try {
    const res = await axios.post(
      JINA_API_URL,
      {
        model: JINA_MODEL,
        input: [text],
        task: "text-matching",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        },
      }
    );

    const embedding = res.data.data[0].embedding as number[];
    productDoc.embedding = embedding;
    await productDoc.save();
    return productDoc;
  } catch (err: any) {
    console.error(" Jina embedding error:", err.message);
    return productDoc;
  }
};

// --- Get recommendations for a specific product ---
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const targetDoc = await Product.findById(productId);
    if (!targetDoc) {
      return res.status(404).json({ error: "Product not found" });
    }

    const target = await ensureEmbedding(targetDoc);

    const others = await Product.find({ _id: { $ne: productId } });

    const embeddedOthers: typeof targetDoc[] = [];
    for (const p of others) {
      if (!p.embedding || p.embedding.length === 0) {
        await ensureEmbedding(p);
      }
      embeddedOthers.push(p);
    }

    const recs = embeddedOthers
      .map((p) => ({
        product: p,
        score: cosineSimilarity(target.embedding ?? [], p.embedding ?? []),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((r) => r.product);

    return res.json({ recommendations: recs });
  } catch (err: any) {
    console.error(" Recommendation error (Jina):", err.message);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
