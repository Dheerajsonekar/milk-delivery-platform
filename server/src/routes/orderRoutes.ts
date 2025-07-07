import express from 'express'
import { placeOrder, getCustomerOrders, getVendorOrders, updateOrderStatus } from '../controllers/orderController'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.post('/', verifyToken, placeOrder)
router.get('/customer', verifyToken, getCustomerOrders)
router.get('/vendor', verifyToken, getVendorOrders)
router.patch('/status', verifyToken, updateOrderStatus)

export default router
