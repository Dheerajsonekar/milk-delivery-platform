import express from 'express'
import { createProduct, getAllProducts, getVendorProducts, updateProduct, deleteProduct } from '../controllers/productController'
import { verifyToken } from '../middlewares/auth'
import { upload } from "../middlewares/upload";

const router = express.Router()

router.post('/', verifyToken, upload.single("image"), createProduct) // Vendor only
router.get('/', getAllProducts)
router.get('/vendor', verifyToken, getVendorProducts) // Vendor products
router.put('/:id', verifyToken, upload.single("image"), updateProduct)
router.delete('/:id', verifyToken, deleteProduct)


export default router
