"use client";
import { useState, useEffect } from "react";

const COLORS = {
  dark: "#213A57",
  teal: "#0B6477",
  blue: "#14919B",
  cyan: "#0AD1C8",
  lightCyan: "#45DFB1",
  green: "#80ED99",
};

const SalesForm = () => {
  const [token, setToken] = useState("");
  const [foodItems, setFoodItems] = useState([
    { itemName: "", quantityPrepared: "", quantitySold: "" },
  ]);
  const [message, setMessage] = useState("");

  // Fetch token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setMessage("❌ Token not found in localStorage");
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updatedItems = [...foodItems];
    updatedItems[index][field] = field.includes("quantity")
      ? Number(value)
      : value;
    setFoodItems(updatedItems);
  };

  const addItem = () => {
    setFoodItems([
      ...foodItems,
      { itemName: "", quantityPrepared: "", quantitySold: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodItems }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit");
      }

      setMessage("✅ Sales data submitted successfully!");
      setFoodItems([{ itemName: "", quantityPrepared: "", quantitySold: "" }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Submission failed. Check the console for details.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-8"
      style={{
        background: `linear-gradient(to right, ${COLORS.dark}, ${COLORS.green})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-[#213A57]">
          Sales Input Form
        </h2>

        {foodItems.map((item, index) => (
          <div key={index} className="bg-[#E0FFEF] p-4 rounded-lg space-y-2">
            <label className="block font-semibold text-[#14919B]">
              Item Name
            </label>
            <input
              type="text"
              value={item.itemName}
              onChange={(e) => handleChange(index, "itemName", e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:outline-none"
              required
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-[#0AD1C8]">
                  Quantity Prepared
                </label>
                <input
                  type="number"
                  value={item.quantityPrepared}
                  onChange={(e) =>
                    handleChange(index, "quantityPrepared", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-md border focus:outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-[#45DFB1]">
                  Quantity Sold
                </label>
                <input
                  type="number"
                  value={item.quantitySold}
                  onChange={(e) =>
                    handleChange(index, "quantitySold", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-md border focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 rounded-lg font-semibold"
          style={{ backgroundColor: COLORS.cyan, color: "#fff" }}
        >
          + Add Another Item
        </button>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold"
          style={{ backgroundColor: COLORS.green, color: COLORS.dark }}
        >
          Submit Sales
        </button>

        {message && (
          <p
            className="text-center mt-2 font-medium"
            style={{ color: COLORS.teal }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SalesForm;
