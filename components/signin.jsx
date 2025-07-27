// SignIn.jsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint =
        role === "seller"
          ? "/api/raw-sellers/login"
          : "/api/street-sellers/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("Token not received from server");
      }

      // Redirect based on role
      if (role === "seller") {
        router.push(`/sellerdashboard?userId=${data.seller.id}`);
      } else {
        router.push(`/buyerdashboard?userId=${data.seller.id}`);
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#213A57] via-[#0AD1C8] to-[#80ED99] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-[#213A57] mb-6 cinzel-bold ">Sign In to FoodChain</h2>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`px-4 py-2 rounded-l-full ${
              role === "buyer"
                ? "bg-[#0AD1C8] text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`px-4 py-2 rounded-r-full ${
              role === "seller"
                ? "bg-[#0AD1C8] text-black"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Seller
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Username and Password Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[black]">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[black]">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45DFB1] text-black"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#45DFB1] text-white py-2 rounded-md hover:bg-[#0AD1C8] transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          New to FoodChain?{" "}
          <Link href="/signup" className="text-[#0AD1C8] hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
