// Register.jsx
import React from 'react';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#213A57] via-[#0AD1C8] to-[#80ED99] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#213A57] mb-6">Register</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#213A57]">Username</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[black]">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[black]">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="w-full bg-[#45DFB1] text-white py-2 rounded-md hover:bg-[#0AD1C8] transition duration-300">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link href="/login">login Here</Link>
        </p>
      </div>
    </div>
  );
}
