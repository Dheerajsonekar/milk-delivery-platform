'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  unit: string
  quantity: number
  image?: string
  vendorId: string
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/vendor')
        setProducts(res.data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
    }
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch {
      alert('Failed to delete product')
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-xl shadow-sm hover:shadow-md transition-all bg-white"
          >
            
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md mb-3 text-gray-400">
                No Image
              </div>
            )}

            
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            <p className="mt-1 font-medium text-gray-700">
              ₹{product.price} / {product.unit}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Available: {product.quantity} {product.unit}
            </p>

            
            <div className="mt-3 flex gap-2">
              <button
                className="flex-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                onClick={() => router.push(`/vendor/products/edit/${product._id}`)}
              >
                Edit
              </button>

              <button
                className="flex-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        
        <div
          onClick={() => router.push('/vendor/products/add')}
          className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
        >
          <Plus size={36} className="text-green-600" />
          <p className="mt-2 text-green-600 font-medium">Add Product</p>
        </div>
      </div>
    </div>
  )
}
