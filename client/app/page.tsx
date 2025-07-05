'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4 text-green-700">Welcome to FreshMilk</h1>
        <p className="text-lg text-gray-700 mb-6">
          We deliver fresh, organic milk and dairy products directly from our farm to your doorstep.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
