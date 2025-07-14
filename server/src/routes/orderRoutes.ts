import express from 'express'
import { placeOrder, getCustomerOrders, cancelCustomerOrder, getVendorOrders, updateOrderStatus } from '../controllers/orderController'
import { verifyToken } from '../middlewares/auth'


const router = express.Router()

router.post('/', verifyToken, placeOrder)

// customer order
router.get('/customer', verifyToken, getCustomerOrders)

//cancel order
router.patch('/:orderId/cancel', verifyToken, cancelCustomerOrder)

//vendor orders
router.get('/vendor', verifyToken, getVendorOrders)

//update orderStatus
router.patch('/status', verifyToken, updateOrderStatus)

export default router
