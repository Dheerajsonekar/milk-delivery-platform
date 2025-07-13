import express from 'express'
import { getDashboardStats } from '../controllers/adminDashboardController'
import { getAllVendors } from '../controllers/adminVendorController'
import { getAllCustomers } from '../controllers/adminCustomerController'
import { getAllAdminProducts } from '../controllers/adminProductController'
import { getAllOrdersAdmin } from '../controllers/adminOrderController'
import { getAllPayouts, updatePayoutStatus } from '../controllers/adminPayoutController'
import { verifyToken, verifyAdmin } from '../middlewares/auth'
import { getAllSubscriptions, updateSubscriptionStatus } from '../controllers/adminSubscriptionController'
import { getAdminReport } from '../controllers/adminReportController'
import { getAdminProfile } from '../controllers/adminProfileController'

const router = express.Router()

// admin profile
router.get('/profile', verifyToken, verifyAdmin, getAdminProfile)


//admin report
router.get('/report', verifyToken, verifyAdmin, getAdminReport)

// ✅ subscriptions
router.get('/subscriptions', verifyToken, verifyAdmin, getAllSubscriptions)
router.patch('/subscriptions/:id', verifyToken, verifyAdmin, updateSubscriptionStatus)


// ✅ Dashboard Stats
router.get('/stats', verifyToken, verifyAdmin, getDashboardStats)



// ✅ Vendor
router.get('/vendors', verifyToken, verifyAdmin, getAllVendors)

// ✅ Customers
router.get('/customers', verifyToken, verifyAdmin, getAllCustomers)

// ✅ Products
router.get('/products', verifyToken, verifyAdmin, getAllAdminProducts)

// ✅ Orders
router.get('/orders', verifyToken, verifyAdmin, getAllOrdersAdmin)

// ✅ Payouts (already present)
router.get('/payouts', verifyToken, verifyAdmin, getAllPayouts)
router.patch('/payouts/:id', verifyToken, verifyAdmin, updatePayoutStatus)

export default router
