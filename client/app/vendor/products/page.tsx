'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function VendorProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/products/vendor')
      setProducts(res.data)
    }
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(products.filter((p) => p._id !== id))
    } catch {
      alert('Failed to delete product')
    }
  }


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-1">₹{product.price} / {product.unit}</p>
            <p className="text-sm text-green-700">Available: {product.quantity} {product.unit}</p>
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
              onClick={() => router.push(`/vendor/products/edit/${product._id}`)}
            >
              Edit
            </button>

            <button
              className="bg-red-600 text-white mx-2 px-2 py-1 rounded hover:bg-red-700 text-sm"
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}
