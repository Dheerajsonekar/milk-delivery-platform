import express from 'express'
import { getPaymentSummary, requestPayout } from '../controllers/vendorController'
import { verifyToken, verifyVendor } from '../middlewares/auth'
import { getVendorCustomers } from '../controllers/vendorCustomerController'

const router = express.Router()

//vendor customer page
router.get('/customers', verifyToken, verifyVendor, getVendorCustomers)

// vendor payment summary
router.get('/payment-summary', verifyToken, verifyVendor, getPaymentSummary) 

//vendor payout request
router.post('/request-payout', verifyToken, verifyVendor, requestPayout)     

export default router