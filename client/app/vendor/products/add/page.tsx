'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function AddProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    quantity: '',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
      router.push('/vendor/products')
    } catch (err) {
      alert('Failed to add product')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-green-700">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="w-full border px-3 py-2" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border px-3 py-2" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" className="w-full border px-3 py-2" onChange={handleChange} required />
        <input name="unit" placeholder="Unit (e.g. liter/kg)" className="w-full border px-3 py-2" onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity Available" className="w-full border px-3 py-2" onChange={handleChange} required />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Add Product
        </button>
      </form>
    </div>
  )
}
