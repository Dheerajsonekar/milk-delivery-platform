import express from 'express'
import { createOrder, verifyPayment } from '../controllers/paymentController'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/create-order', verifyToken, createOrder)
router.post('/verify', verifyToken, verifyPayment)

export default router
