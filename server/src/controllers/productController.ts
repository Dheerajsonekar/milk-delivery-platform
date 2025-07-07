import Product from '../models/Product'
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, unit, quantity , description, image } = req.body
    const vendorId = req.user.id // from auth middleware

    const product = await Product.create({ name, price, unit, quantity,  description, image, vendorId })
    return res.status(201).json(product)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message })
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('vendorId', 'name')
    return res.json(products)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get products', error: err.message })
  }
}

export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const products = await Product.find({ vendorId })
    return res.json(products)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get vendor products', error: err.message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const productId = req.params.id

    const updated = await Product.findOneAndUpdate(
      { _id: productId, vendorId },
      req.body,
      { new: true }
    )

    if (!updated) return res.status(404).json({ message: 'Product not found or unauthorized' })

    res.json(updated)
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update product', error: err.message })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const productId = req.params.id

    const deleted = await Product.findOneAndDelete({ _id: productId, vendorId })

    if (!deleted) return res.status(404).json({ message: 'Product not found or unauthorized' })

    res.json({ message: 'Product deleted successfully' })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message })
  }
}

