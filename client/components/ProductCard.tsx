'use client'

import { useCart } from '@/context/cart-context'
import { useRouter } from 'next/navigation'

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    router.push('/customer/cart/checkout')
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
  }

  const handleViewDetails = () => {
    router.push(`/products/${product._id}`)
  }

  return (
    <div
      onClick={handleViewDetails}
      className="border rounded-lg shadow-sm hover:shadow-md transition bg-white overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image  */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-24 object-cover hover:opacity-90 transition"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-24 flex items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}

      {/* Product info */}
      <div className="p-2 flex flex-col justify-between flex-grow">
        <div>
          <h3
            onClick={handleViewDetails}
            className="font-bold text-lg text-gray-800 hover:text-green-700 transition"
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <p className="text-sm text-green-600 mt-1">
            Vendor: {product.vendorId?.name || 'Unknown'}
          </p>
          <p className="mt-1 font-medium text-gray-700">
            ₹{product.price} / {product.unit}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
