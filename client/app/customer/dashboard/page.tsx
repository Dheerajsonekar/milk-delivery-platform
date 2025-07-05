'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard'

export default function CustomerDashboard() {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const res = await api.get('/products')
    setProducts(res.data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const placeOrder = async (productId: string) => {
    try {
      const res = await api.post('/orders', {
        productId,
        quantity: 1, // you can make this dynamic later
      })
      alert('Order placed successfully!')
    } catch (err) {
      alert('Failed to place order')
    }
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome! You can view your orders, subscriptions, and profile here.</p>
      </div>

      {/* Product Listing */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            showOrderButton
            onOrder={() => placeOrder(product._id)}
          />
        ))}
      </div>
    </div>
  )
}
