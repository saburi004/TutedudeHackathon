"use client";
import React, { useState } from "react";

function SellerFinder() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load available products on component mount
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-products");
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setAvailableProducts(data.products);
          }
        }
      } catch (err) {
        console.log("Could not load product suggestions:", err);
      }
    };
    
    fetchProducts();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGetSellers();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    
    // Clear previous error when user starts typing
    if (error && value.trim()) {
      setError(null);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product);
    setShowSuggestions(false);
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery || !availableProducts.length) return [];
    
    return availableProducts
      .filter(product => 
        product.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Show max 5 suggestions
  };

  const handleGetSellers = () => {
    // Validate search input
    if (!searchQuery.trim()) {
      setError("Please enter a product name to search");
      return;
    }

    setLoading(true);
    setError(null);
    setSellers([]); // Clear previous results

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const payload = {
          latitude: lat,
          longitude: lon,
          product: searchQuery.trim(),
        };

        console.log("Sending payload:", payload);

        try {
          const response = await fetch(
            "http://localhost:5000/api/get-sellers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorBody = await response.text();
            console.error("Backend error response:", response.status, errorBody);
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          console.log("Response data:", data);

          if (data.status === "success") {
            setSellers(data.top_sellers || []);
            if (data.top_sellers.length === 0) {
              setError("No sellers found for the given criteria");
            }
          } else {
            setError(data.message || "Unknown error occurred");
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setError(`Failed to fetch sellers: ${err.message}`);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Location access denied or unavailable.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Find Top Sellers</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="product-search" style={{ 
          display: "block", 
          marginBottom: "8px", 
          fontWeight: "bold" 
        }}>
          Search for a product:
        </label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              id="product-search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g., Potatoes, Tomatoes, Rice, Milk..."
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.3s"
              }}
            />
            
            {showSuggestions && getFilteredSuggestions().length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderTop: "none",
                borderRadius: "0 0 5px 5px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                {getFilteredSuggestions().map((product, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(product)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      borderBottom: index < getFilteredSuggestions().length - 1 ? "1px solid #eee" : "none",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                  >
                    🥬 {product}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleGetSellers}
            disabled={loading || !searchQuery.trim()}
            style={{
              padding: "12px 24px",
              backgroundColor: loading || !searchQuery.trim() ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading || !searchQuery.trim() ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
          >
            {loading ? "Searching..." : "🔍 Find Sellers"}
          </button>
        </div>
        
        <div style={{ 
          marginTop: "8px", 
          fontSize: "14px", 
          color: "#666" 
        }}>
          💡 Tip: Start typing to see product suggestions, or press Enter to search
        </div>
      </div>

      {error && (
        <div style={{ 
          color: "red", 
          marginTop: "10px", 
          padding: "10px", 
          backgroundColor: "#fee", 
          borderRadius: "5px" 
        }}>
          Error: {error}
        </div>
      )}

      {sellers.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Top Sellers Found:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sellers.map((seller, index) => (
              <li 
                key={seller.Seller_ID || index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {seller.Name || `Seller ${seller.Seller_ID}`}
                </div>
                <div style={{ margin: "5px 0" }}>
                  <strong>Location:</strong> {seller.Locality || "N/A"}
                </div>
                <div style={{ margin: "5px 0" }}>
                  <strong>Distance:</strong> {(seller.Distance_km || 0).toFixed(2)} km
                </div>
                <div style={{ margin: "5px 0" }}>
                  <strong>Price:</strong> ₹{(seller.Price_per_kg || 0).toFixed(2)}/kg
                </div>
                <div style={{ margin: "5px 0" }}>
                  <strong>Rating:</strong> {(seller.Rating || 0).toFixed(1)}/5.0
                  {seller.Verified && (
                    <span style={{ 
                      marginLeft: "10px", 
                      padding: "2px 6px", 
                      backgroundColor: "#28a745", 
                      color: "white", 
                      borderRadius: "3px", 
                      fontSize: "12px" 
                    }}>
                      Verified
                    </span>
                  )}
                </div>
                <div style={{ margin: "5px 0" }}>
                  <strong>Score:</strong> {(seller.Score || 0).toFixed(3)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SellerFinder;