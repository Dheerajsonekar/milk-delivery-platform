import { Request, Response } from "express";
import Product from "../models/Product";


export const createProduct = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const vendorId = req.user.id;
    const { name, price, unit, quantity, description } = req.body;

    
    const imageUrl = (req.file as Express.Multer.File)?.path;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required" });
    }

    
    const product = await Product.create({
      name,
      price,
      unit,
      quantity,
      description,
      vendorId,
      image: imageUrl, // cloudinary URL
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err: any) {
    console.error("Product creation failed:", err);
    return res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("vendorId", "name");
    return res.json(products);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to get products", error: err.message });
  }
};


export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const vendorId = req.user.id;
    const products = await Product.find({ vendorId });
    return res.json(products);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to get vendor products", error: err.message });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const vendorId = req.user.id;
    const productId = req.params.id;

    
    const imageUrl = (req.file as Express.Multer.File)?.path;
    const updateData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    };

    const updated = await Product.findOneAndUpdate(
      { _id: productId, vendorId },
      updateData,
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    res.json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const vendorId = req.user.id;
    const productId = req.params.id;

    const deleted = await Product.findOneAndDelete({ _id: productId, vendorId });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};
