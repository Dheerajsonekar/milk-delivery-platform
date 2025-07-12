import express from 'express'
import { getPaymentSummary, requestPayout } from '../controllers/vendorController'
import { verifyToken } from '../middlewares/auth'

const router = express.Router()

router.get('/payment-summary', verifyToken, getPaymentSummary) // ✅ Summary
router.post('/request-payout', verifyToken, requestPayout)     // ✅ Request payout

export default router
