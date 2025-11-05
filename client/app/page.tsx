'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/context/auth-context'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const { isLoggedIn, loading } = useAuth()

  // Debounce search for smoother performance
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts()
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search, category])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', {
        params: { search, category },
      })
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          {isLoggedIn ? 'Available Products' : 'FreshMilk Products'}
        </h2>

        {/*  Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-2/3 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-1/3 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
          >
            <option value="All">All Categories</option>
            <option value="Milk">Milk</option>
            <option value="Curd">Curd</option>
            <option value="Butter">Butter</option>
            <option value="Cheese">Cheese</option>
            <option value="Ghee">Ghee</option>
            <option value="Paneer">Paneer</option>
            <option value="Flavored Milk">Flavored Milk</option>
            <option value="Fruit">Fruit</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Dry Fruit">Dry Fruit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
