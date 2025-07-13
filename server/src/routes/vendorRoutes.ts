import express from 'express'
import { getPaymentSummary, requestPayout } from '../controllers/vendorController'
import { verifyToken, verifyVendor } from '../middlewares/auth'
import { getVendorCustomers } from '../controllers/vendorCustomerController'
import { getVendorDashboard } from '../controllers/vendorDashboardController'
import { getVendorOrdersStats } from '../controllers/vendorOrderController'
import { getVendorSubscription } from '../controllers/vendorSubscriptionController'

const router = express.Router()


// vendor subscription
router.get('/subscription', verifyToken, verifyVendor, getVendorSubscription)



// vendor order
router.get('/orders/stats', verifyToken, verifyVendor, getVendorOrdersStats)


//vendor dashboard
router.get('/dashboard', verifyToken, verifyVendor, getVendorDashboard)

//vendor customer page
router.get('/customers', verifyToken, verifyVendor, getVendorCustomers)

// vendor payment summary
router.get('/payouts', verifyToken, verifyVendor, getPaymentSummary)

//vendor payout request
router.post('/payouts/request', verifyToken, verifyVendor, requestPayout)

export default router