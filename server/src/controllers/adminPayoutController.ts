import { Request, Response } from 'express'
import Payout from '../models/Payout'

// GET all payout requests
export const getAllPayouts = async (_req: Request, res: Response) => {
  try {
    const payouts = await Payout.findAll()
    res.json(payouts)
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching payouts', error: err.message })
  }
}

// PATCH approve/reject payout
export const updatePayoutStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const payout = await Payout.findByPk(id)
    if (!payout) return res.status(404).json({ message: 'Payout not found' })

   await payout.update({ status });

    res.json({ message: `Payout ${status}`, payout })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update payout', error: err.message })
  }
}
