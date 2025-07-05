import express from 'express'
import { createProduct, getAllProducts, getVendorProducts } from '../controllers/productController'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/', verifyToken, createProduct) // Vendor only
router.get('/', getAllProducts)
router.get('/vendor', verifyToken, getVendorProducts) // Vendor products

export default router
