'use client';
import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingCart, FaSearch, FaMapMarkerAlt, FaEnvelope, FaPhone, FaArrowLeft, FaUser, FaCheckCircle } from 'react-icons/fa';

// Seller Details Component
const SellerDetails = ({ seller, onBack }) => {
  // Debug: Log all seller properties to console
  console.log("Seller object in details:", seller);
  console.log("All available keys:", Object.keys(seller));

  // Helper function to get email from various possible field names
  const getEmail = (seller) => {
    const possibleEmailFields = ['Email', 'email', 'Email_Address', 'email_address', 'emailAddress', 'EMAIL', 'contact_email', 'contactEmail'];
    for (const field of possibleEmailFields) {
      if (seller[field] && seller[field].trim()) {
        console.log(`Found email in field: ${field} = ${seller[field]}`);
        return seller[field];
      }
    }
    console.log("No email field found");
    return null;
  };

  // Helper function to get mobile from various possible field names
  const getMobile = (seller) => {
    const possibleMobileFields = ['Mobile', 'mobile', 'Phone', 'phone', 'Mobile_Number', 'mobile_number', 'mobileNumber', 'phoneNumber', 'MOBILE', 'PHONE', 'contact_mobile', 'contactMobile', 'contact_phone', 'contactPhone'];
    for (const field of possibleMobileFields) {
      if (seller[field] && seller[field].toString().trim()) {
        console.log(`Found mobile in field: ${field} = ${seller[field]}`);
        return seller[field];
      }
    }
    console.log("No mobile field found");
    return null;
  };

  const email = getEmail(seller);
  const mobile = getMobile(seller);

  console.log("Final email:", email);
  console.log("Final mobile:", mobile);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#086477] hover:text-[#213A57] font-medium transition-colors"
        >
          <FaArrowLeft /> Back to Sellers
        </button>
      </div>

      {/* Seller Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#45DFB1]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#14919B] to-[#0AD1C8] p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <FaUser className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {seller.Name || `Seller ${seller.Seller_ID}`}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-300" />
                    <span className="text-lg font-medium">
                      {(seller.Rating || 0).toFixed(1)}/5.0
                    </span>
                  </div>
                  {seller.Verified && (
                    <div className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
                      <FaCheckCircle className="text-sm" />
                      <span className="text-sm font-medium">Verified Seller</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Seller ID</div>
              <div className="text-lg font-mono">{seller.Seller_ID}</div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#213A57] border-b border-[#45DFB1] pb-2">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {email && (
                  <div className="flex items-center gap-3 p-4 bg-[#f0fffe] rounded-lg border border-[#45DFB1]">
                    <div className="bg-[#0AD1C8] p-2 rounded-full text-white">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email Address</div>
                      <a 
                        href={`mailto:${email}`}
                        className="text-[#086477] font-medium hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {mobile && (
                  <div className="flex items-center gap-3 p-4 bg-[#f0fffe] rounded-lg border border-[#45DFB1]">
                    <div className="bg-[#0AD1C8] p-2 rounded-full text-white">
                      <FaPhone />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Mobile Number</div>
                      <a 
                        href={`tel:${mobile}`}
                        className="text-[#086477] font-medium hover:underline"
                      >
                        {mobile}
                      </a>
                    </div>
                  </div>
                )}

                {!email && !mobile && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-yellow-600">
                      ⚠️ Contact information not available for this seller
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-[#f0fffe] rounded-lg border border-[#45DFB1]">
                  <div className="bg-[#0AD1C8] p-2 rounded-full text-white">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-[#086477] font-medium">
                      {seller.Locality || "Location not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Statistics */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#213A57] border-b border-[#45DFB1] pb-2">
                Seller Details
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#80ED99] to-[#45DFB1] p-6 rounded-lg text-white">
                  <div className="text-sm opacity-90">Overall Rating</div>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <FaStar className="text-yellow-300" />
                    {(seller.Rating || 0).toFixed(1)}
                  </div>
                  <div className="text-sm opacity-90">out of 5.0</div>
                </div>

                {seller.Price_per_kg !== undefined && (
                  <div className="bg-[#f8f9fa] p-4 rounded-lg border border-[#e9ecef]">
                    <div className="text-sm text-gray-600">Price per Kg</div>
                    <div className="text-2xl font-bold text-[#0AD1C8]">
                      ₹{seller.Price_per_kg.toFixed(2)}
                    </div>
                  </div>
                )}

                {seller.Distance_km !== undefined && (
                  <div className="bg-[#f8f9fa] p-4 rounded-lg border border-[#e9ecef]">
                    <div className="text-sm text-gray-600">Distance from You</div>
                    <div className="text-xl font-semibold text-[#213A57]">
                      {seller.Distance_km.toFixed(2)} km
                    </div>
                  </div>
                )}

                {seller.Score !== undefined && (
                  <div className="bg-[#f8f9fa] p-4 rounded-lg border border-[#e9ecef]">
                    <div className="text-sm text-gray-600">Seller Score</div>
                    <div className="text-xl font-semibold text-[#213A57]">
                      {seller.Score.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Based on rating, distance, and price
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#45DFB1]">
            <div className="flex gap-4 justify-center">
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="bg-[#0AD1C8] hover:bg-[#086477] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FaEnvelope /> Send Email
                </a>
              )}
              {mobile && (
                <a 
                  href={`tel:${mobile}`}
                  className="bg-[#80ED99] hover:bg-[#45DFB1] text-[#213A57] px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FaPhone /> Call Now
                </a>
              )}
              {!email && !mobile && (
                <div className="text-center text-gray-500">
                  Contact information not available for this seller
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuyItems = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        
        // Load available products for suggestions
        try {
          const productsResponse = await fetch("https://clustering-model.onrender.com/api/get-products");
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            console.log("Products response:", productsData);
            if (productsData.status === "success") {
              setAvailableProducts(productsData.products || []);
            }
          } else {
            console.warn("Failed to load products:", productsResponse.status);
          }
        } catch (err) {
          console.warn("Error loading products:", err);
        }

        // Load initial sellers
        try {
          const sellersResponse = await fetch("https://clustering-model.onrender.com/api/get-initial-sellers");
          console.log("Sellers response status:", sellersResponse.status);
          
          if (sellersResponse.ok) {
            const sellersData = await sellersResponse.json();
            console.log("Sellers data:", sellersData);
            
            if (sellersData.status === "success") {
              const sellersArray = sellersData.sellers || [];
              console.log("Setting sellers:", sellersArray);
              setSellers(sellersArray);
              
              if (sellersArray.length === 0) {
                setError("No sellers available in the database. Please add some sellers first.");
              }
            } else {
              setError(sellersData.message || "Failed to load sellers");
            }
          } else {
            const errorText = await sellersResponse.text();
            console.error("Sellers API error:", errorText);
            setError(`Failed to load sellers: ${sellersResponse.status}`);
          }
        } catch (err) {
          console.error("Error loading sellers:", err);
          setError(`Network error: ${err.message}`);
        }
        
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSellers();
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
      .slice(0, 5);
  };

  const handleSearchSellers = () => {
    // Validate search input
    if (!searchQuery.trim()) {
      setError("Please enter a product name to search");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log("Using location:", lat, lon);

        const payload = {
          latitude: lat,
          longitude: lon,
          product: searchQuery.trim(),
        };

        try {
          const response = await fetch(
            "https://clustering-model.onrender.com/api/get-sellers",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          console.log("Search response status:", response.status);

          if (!response.ok) {
            const errorBody = await response.text();
            console.error("Backend error response:", response.status, errorBody);
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          const data = await response.json();
          console.log("Search results:", data);

          if (data.status === "success") {
            setSellers(data.top_sellers || []);
            if (data.top_sellers.length === 0) {
              setError("No sellers found for the given product");
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
        setError("Location access denied or unavailable. Showing general results.");
        
        // Fallback: search without location
        searchWithoutLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const searchWithoutLocation = async () => {
    try {
      const response = await fetch(
        "https://clustering-model.onrender.com/api/search-sellers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product: searchQuery.trim() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fallback search results:", data);
        if (data.status === "success") {
          setSellers(data.sellers || []);
        }
      }
    } catch (err) {
      console.error("Fallback search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetToInitialState = () => {
    setSearchQuery("");
    setHasSearched(false);
    setError(null);
    setInitialLoading(true);
    
    // Reload initial sellers
    fetch("https://clustering-model.onrender.com/api/get-initial-sellers")
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          setSellers(data.sellers || []);
        }
      })
      .catch(err => {
        console.error("Error reloading initial sellers:", err);
        setError("Failed to reload sellers");
      })
      .finally(() => {
        setInitialLoading(false);
      });
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
  };

  const handleBackToList = () => {
    setSelectedSeller(null);
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0AD1C8] mx-auto mb-4"></div>
            <p className="text-[#213A57]">Loading sellers...</p>
          </div>
        </div>
      </div>
    );
  }

  // If a seller is selected, show the details page
  if (selectedSeller) {
    return <SellerDetails seller={selectedSeller} onBack={handleBackToList} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#213A57] mb-6 flex items-center">
        <FaShoppingCart className="mr-2" /> Buy Food Items
      </h1>
      
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-[#45DFB1]">
        <div className="mb-4">
          <label htmlFor="product-search" className="block text-sm font-medium text-[#213A57] mb-2">
            Search for a specific product:
          </label>
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g., Potatoes, Tomatoes, Rice, Milk..."
                className="w-full px-4 py-3 border-2 border-[#45DFB1] rounded-lg focus:outline-none focus:border-[#0AD1C8] transition-colors"
              />
              
              {showSuggestions && getFilteredSuggestions().length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-[#45DFB1] border-t-0 rounded-b-lg max-h-48 overflow-y-auto z-50 shadow-lg">
                  {getFilteredSuggestions().map((product, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(product)}
                      className="px-4 py-3 cursor-pointer hover:bg-[#f0fffe] border-b border-[#45DFB1] last:border-b-0 flex items-center"
                    >
                      🥬 <span className="ml-2">{product}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={handleSearchSellers}
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-3 bg-[#0AD1C8] hover:bg-[#086477] disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FaSearch />
              {loading ? "Searching..." : "Find Sellers"}
            </button>
            
            {hasSearched && (
              <button 
                onClick={resetToInitialState}
                className="px-4 py-3 bg-[#14919B] hover:bg-[#213A57] text-white rounded-lg font-medium transition-colors"
              >
                Show All
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            💡 {hasSearched ? 
              "Showing search results. Click 'Show All' to see all available sellers." : 
              "Start typing to see product suggestions, or browse all available sellers below."
            }
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0AD1C8] mx-auto mb-2"></div>
          <p className="text-[#213A57]">Searching for sellers...</p>
        </div>
      )}

      {/* Results Header */}
      {!loading && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#213A57]">
            {hasSearched ? 
              `Search Results for "${searchQuery}" (${sellers.length} found)` : 
              `Available Sellers (${sellers.length})`
            }
          </h2>
        </div>
      )}

      {/* Sellers Grid */}
      {!loading && sellers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller, index) => {
            // Add safe defaults for missing fields
            const safeRating = seller.Rating || 0;
            const safeName = seller.Name || `Seller ${seller.Seller_ID || index + 1}`;
            const safeLocation = seller.Locality || "Location not specified";
            const safePrice = seller.Price_per_kg || null;
            const safeDistance = seller.Distance_km || null;
            const safeScore = seller.Score || null;
            const isVerified = seller.Verified === true || seller.Verified === 1 || seller.Verified === "true";
            
            return (
              <div key={`seller-${seller.Seller_ID || index}`} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#45DFB1] hover:shadow-lg transition-shadow">
                <div className="bg-[#14919B] p-4 text-white">
                  <h3 className="text-xl font-semibold truncate">
                    {safeName}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-300 mr-1" />
                      <span>{safeRating.toFixed(1)}/5.0</span>
                    </div>
                    {isVerified && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-[#0AD1C8] flex-shrink-0" />
                      <span className="truncate">{safeLocation}</span>
                    </div>
                    
                    {safeDistance !== null && (
                      <div className="text-sm">
                        <strong className="text-[#086477]">Distance:</strong> {safeDistance.toFixed(2)} km
                      </div>
                    )}
                    
                    {safePrice !== null && (
                      <div className="text-sm">
                        <strong className="text-[#086477]">Price:</strong> 
                        <span className="text-[#0AD1C8] font-bold ml-1">₹{safePrice.toFixed(2)}/kg</span>
                      </div>
                    )}
                    
                    {safeScore !== null && (
                      <div className="text-sm">
                        <strong className="text-[#086477]">Score:</strong> {safeScore.toFixed(3)}
                      </div>
                    )}

                    {/* Show Seller ID for debugging */}
                    <div className="text-xs text-gray-500">
                      ID: {seller.Seller_ID || `temp-${index}`}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleViewDetails(seller)}
                      className="flex-1 bg-[#0AD1C8] hover:bg-[#086477] text-white py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!loading && sellers.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[#213A57] mb-2">No sellers found</h3>
          <p className="text-gray-600">
            {hasSearched ? 
              "Try searching for a different product or check your spelling." : 
              "No sellers are currently available. Please try again later."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyItems;