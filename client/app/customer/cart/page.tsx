'use client'

import { useCart } from '@/context/cart-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { cart, addToCart, removeFromCart, setCart } = useCart()
  const [localCart, setLocalCart] = useState(cart)
  const router = useRouter()

  useEffect(() => {
    setLocalCart(cart)
  }, [cart])

  const handleDecrease = (id: string) => {
    const item = cart.find((item) => item._id === id)
    if (!item) return

    if (item.quantity <= 1) {
      removeFromCart(id)
    } else {
      setCart((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
      )
    }
  }

  const handleIncrease = (item: typeof cart[0]) => {
    addToCart(item)
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!')
    } else {
      router.push('/customer/cart/checkout')
    }
  }

  return (
    <div  className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className=" text-center text-xl font-bold mb-4">Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded mb-2 shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {item.name} {item.unit}
                </p>
                <p className="text-sm text-gray-600">₹{item.price} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrease(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  –
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <p className="mt-4 font-bold text-lg">Total: ₹{totalAmount}</p>

          <button
            onClick={handleGoToCheckout}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  )
}
