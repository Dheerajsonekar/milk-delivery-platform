'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import ProductCard from '@/components/ProductCard'

export default function VendorProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '', price: '', unit: 'liter', description: ''
  })

  const fetchVendorProducts = async () => {
    const res = await api.get('/products/vendor')
    setProducts(res.data)
  }

  useEffect(() => {
    fetchVendorProducts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/products', form)
    setForm({ name: '', price: '', unit: 'liter', description: '' })
    fetchVendorProducts()
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>

      <form onSubmit={handleAddProduct} className="mb-6 space-y-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="border w-full p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="border w-full p-2 rounded"
        />
        <select
          name="unit"
          value={form.unit}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        >
          <option value="liter">Liter</option>
          <option value="kg">Kg</option>
          <option value="piece">Piece</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border w-full p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  )
}
