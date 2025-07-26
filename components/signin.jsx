// SignIn.jsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';

export default function SignIn() {
  const [role, setRole] = useState('seller');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#213A57] via-[#0AD1C8] to-[#80ED99] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#213A57] mb-6">Sign In to FoodChain</h2>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole('seller')}
            className={`px-4 py-2 rounded-l-full ${role === 'seller' ? 'bg-[#0AD1C8] text-black' : 'bg-gray-200 text-gray-700'}`}
          >
            Seller
          </button>
          <button
            onClick={() => setRole('vendor')}
            className={`px-4 py-2 rounded-r-full ${role === 'vendor' ? 'bg-[#0AD1C8] text-black' : 'bg-gray-200 text-gray-700'}`}
          >
            Vendor
          </button>
        </div>

        {/* Username and Password Fields */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[black]">Username</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[black]">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="w-full bg-[#45DFB1] text-white py-2 rounded-md hover:bg-[#0AD1C8] transition duration-300">
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          New to FoodChain?{' '}
         <Link href="/signup">Register Here</Link>
        </p>
      </div>
    </div>
  );
}
