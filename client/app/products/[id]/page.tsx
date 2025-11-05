'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { useCart } from '@/context/cart-context'
import ProductCard from '@/components/ProductCard' 

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSimilar, setLoadingSimilar] = useState(false)

  //  Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        console.error('Failed to fetch product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  //  Fetch similar products using AI recommendations
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!id) return
      try {
        setLoadingSimilar(true)
        const res = await api.get(`/ai/recommend/${id}`) // from aiController
        setSimilarProducts(res.data.recommendations || [])
      } catch (err) {
        console.error('Failed to fetch similar products:', err)
      } finally {
        setLoadingSimilar(false)
      }
    }
    fetchSimilar()
  }, [id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading product details...
      </div>
    )

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Product not found.
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/*  Product Section */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
        {/*  Product image */}
        <div className="md:w-1/2">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg border"
          />
        </div>

        {/* Product info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-sm text-green-600 font-semibold mb-2">
            Category: {product.category || 'Other'}
          </p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-lg font-semibold mb-2">
            ₹{product.price} / {product.unit}
          </p>
          <p className="text-sm text-green-700 mb-4">
            Available: {product.quantity} {product.unit}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product)
                router.push('/customer/cart/checkout')
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/*  Similar Products Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Similar Products You Might Like
        </h2>

        {loadingSimilar ? (
          <p className="text-gray-500">Loading similar products...</p>
        ) : similarProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No similar products found.</p>
        )}
      </div>
    </div>
  )
}
