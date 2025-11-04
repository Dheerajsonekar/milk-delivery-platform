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
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      alert('Please select a product image')
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('unit', form.unit)
    formData.append('quantity', form.quantity)
    formData.append('image', image) 

    try {
      setLoading(true)
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      router.push('/vendor/products')
    } catch (err) {
      console.error(err)
      alert('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-green-700">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="unit"
          placeholder="Unit (e.g. liter/kg)"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity Available"
          className="w-full border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Preview selected image */}
        {image && (
          <div className="mt-2 text-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="h-40 w-auto mx-auto rounded border object-cover"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-70"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
