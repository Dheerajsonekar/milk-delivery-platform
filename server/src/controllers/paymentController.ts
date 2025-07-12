import { Request, Response } from 'express'
import razorpay from '../utils/razorpay'
import crypto from 'crypto'

export const createOrder = async (req: Request, res: Response) => {
  const { amount } = req.body

  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    res.json(order)
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create Razorpay order', error: err.message })
  }
}

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const sign = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true })
  } else {
    return res.status(400).json({ success: false, message: "Signature mismatch" })
  }
}
