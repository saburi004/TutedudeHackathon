"use client";

import { useEffect, useState } from "react";

const WastePrediction = () => {
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/waste-predict", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error: ${text}`);
        }

        const rawText = await response.text();

        const blocks = rawText
          .trim()
          .split(/\n\s*\n/) // Split by blank lines
          .map((block) => {
            const nameMatch = block.match(/Raw Material:\s*(.+)/);
            const quantityMatch = block.match(/Quantity to Order:\s*(.+)/);
            const reasonMatch = block.match(/Reason:\s*(.+)/);

            return {
              name: nameMatch?.[1] || "N/A",
              quantity: quantityMatch?.[1] || "N/A",
              reason: reasonMatch?.[1] || "N/A",
            };
          });

        setParsedData(blocks);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Waste Prediction Report
      </h1>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
      {loading && !error && (
        <p className="text-gray-500">Fetching prediction...</p>
      )}

      {!error && !loading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {parsedData.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-green-700 mb-1">
                {item.name}
              </h3>
              <p className="text-gray-800 mb-1">
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p className="text-gray-600 text-sm">{item.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WastePrediction;
