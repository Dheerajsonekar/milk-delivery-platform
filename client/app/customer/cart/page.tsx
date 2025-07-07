'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(localCart)
  }, [])

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vendorId = cart[0]?.vendorId

  const handleCheckout = async () => {
    try {
      const orderPayload = {
        vendorId,
        totalAmount,
        products: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      }

      await api.post('/orders', orderPayload)
      localStorage.removeItem('cart')
      alert('Order placed successfully!')
      router.push('/customer/orders')
    } catch (err: any) {
      alert('Order failed: ' + err.response?.data?.message)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} className="border p-4 rounded mb-2 shadow">
              <p>{item.name} - ₹{item.price} x {item.quantity}</p>
            </div>
          ))}

          <p className="mt-4 font-bold">Total: ₹{totalAmount}</p>

          <button
            onClick={handleCheckout}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  )
}
