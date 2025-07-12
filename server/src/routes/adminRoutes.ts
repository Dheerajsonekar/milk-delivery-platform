import express from 'express'
import { adminLogin } from '../controllers/adminController'
import { getAllPayouts, updatePayoutStatus } from '../controllers/adminPayoutController'
import { verifyToken, verifyAdmin } from '../middlewares/auth'

const router = express.Router()
router.post('/login', adminLogin)
router.get('/payouts', verifyToken, verifyAdmin, getAllPayouts)
router.patch('/payouts/:id', verifyToken, verifyAdmin, updatePayoutStatus)
export default router
