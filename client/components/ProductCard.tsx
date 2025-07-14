'use client'

import { useCart } from '@/context/cart-context'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleBuyNow = () => {
    addToCart(product)
    router.push('/customer/cart/checkout')
  }

  return (
    <div className="border p-4 rounded shadow bg-white flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
        <p className="text-sm text-green-600">Vendor: {product.vendorId?.name || 'Unknown'}</p>
        <p className="mt-1">₹{product.price} / {product.unit}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
        
      </div>
    </div>
  )
}

export default ProductCard
