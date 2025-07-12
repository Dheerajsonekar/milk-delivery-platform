'use client'

import { useCart } from '@/context/cart-context'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      document.body.appendChild(script)
    })

  const handlePayment = async () => {
    if (!cart.length) return alert('Cart is empty!')

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      return alert('Please fill the address completely.')
    }

    await loadRazorpay()

    const orderRes = await api.post('/payment/create-order', { amount: totalAmount })

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: orderRes.data.amount,
      currency: 'INR',
      name: 'FreshMilk',
      description: 'Milk Order',
      order_id: orderRes.data.id,
      handler: async (response: any) => {
        const verifyRes = await api.post('/payment/verify', response)

        if (verifyRes.data.success) {
          await api.post('/orders', {
            products: cart.map(item => ({
              productId: item._id,
              quantity: item.quantity,
            })),
            vendorId: cart[0]?.vendorId,
            totalAmount,
            deliveryAddress: address,
          })

          clearCart()
          router.push('/customer/orders')
        } else {
          alert('Payment verification failed!')
        }
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
      },
      theme: { color: '#22c55e' },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-center text-xl font-bold mb-4">Checkout</h2>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link href="/customer/products">
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="border p-2 rounded">
                <strong>{item.name}</strong> × {item.quantity} – ₹{item.price}
              </li>
            ))}
          </ul>

          {/* Address Form */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Street" className="border p-2" value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            <input type="text" placeholder="City" className="border p-2" value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <input type="text" placeholder="State" className="border p-2" value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            <input type="text" placeholder="Zip Code" className="border p-2" value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
          </div>

          <p className="text-left font-semibold">Total: ₹{totalAmount}</p>
          <button
            onClick={handlePayment}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Pay Now
          </button>
        </>
      )}
    </div>
  )
}
