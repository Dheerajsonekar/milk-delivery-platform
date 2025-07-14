'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard' 

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
    
  }

  return (
    <div className="p-4">
     <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Products</h1>
         
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
