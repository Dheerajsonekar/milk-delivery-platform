'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', description: '', price: '', unit: '', quantity: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products/${id}`)
      const { name, description, price, unit, quantity } = res.data
      setForm({ name, description, price, unit, quantity })
    }
    fetchProduct()
  }, [id])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
      router.push('/vendor/products')
    } catch {
      alert('Update failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-green-700">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border px-3 py-2" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2" required />
        <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit" className="w-full border px-3 py-2" required />
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full border px-3 py-2" required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Update Product</button>
      </form>
    </div>
  )
}
