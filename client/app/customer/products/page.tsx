'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard' // ✅ import the reusable card

export default function CustomerProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get('/products')
      setProducts(res.data)
    }
    fetchProducts()
  }, [])

  const handleOrder = (product: any) => {
    alert(`Placing order for: ${product.name}`)
    // 🧩 You can replace alert with actual order placement logic later
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            showOrderButton
            onOrder={() => handleOrder(product)}
          />
        ))}
      </div>
    </div>
  )
}
