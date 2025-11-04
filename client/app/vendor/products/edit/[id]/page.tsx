'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: '',
    quantity: '',
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`)
        const { name, category, description, price, unit, quantity } = res.data
        setForm({
          name,
          category: category || '',
          description,
          price,
          unit,
          quantity,
        })
      } catch (err) {
        console.error('Failed to fetch product:', err)
        alert('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
      router.push('/vendor/products')
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product details...
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-green-700">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* 🆕 Category dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Milk">Milk</option>
          <option value="Curd">Curd</option>
          <option value="Butter">Butter</option>
          <option value="Cheese">Cheese</option>
          <option value="Ghee">Ghee</option>
          <option value="Paneer">Paneer</option>
          <option value="Flavored Milk">Flavored Milk</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit (e.g. liter/kg)"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity Available"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  )
}
