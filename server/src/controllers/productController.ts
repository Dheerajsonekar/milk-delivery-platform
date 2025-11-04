import { Request, Response } from "express";
import Product from "../models/Product";


export const createProduct = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const vendorId = req.user.id;
    const { name, price, unit, quantity, description, category } = req.body;
    
    if(!category){
      return res.status(400).json({ message: "Product category is required" });
    }
    
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
      image: imageUrl,
      category,

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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("vendorId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err: any) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    const query: any = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Search by name or description (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query).populate("vendorId", "name");

    res.json(products);
  } catch (err: any) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to get products", error: err.message });
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

    const {category} = req.body;
    const imageUrl = (req.file as Express.Multer.File)?.path;
    const updateData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
      ...(category && {category}),
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
