'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FaStore, FaArrowRight, FaArrowLeft, FaUser, FaTimes 
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiMeat } from 'react-icons/gi';

const SellerDashboard = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [profileComplete, setProfileComplete] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardStats, setDashboardStats] = useState([
    { title: "Available Materials", value: "0", icon: <GiMeal className="text-2xl" />, color: "bg-[#45DFB1]" },
    { title: "Location", value: "Not set", icon: <FaStore className="text-2xl" />, color: "bg-[#80ED99]" }
  ]);
  const [sellerInfo, setSellerInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    location: {
      latitude: '',
      longitude: '',
      address: ''
    },
    availableMaterials: []
  });

  // Updated materials list to match your database structure
  const commonMaterials = [
    { id: 'flour', name: "Flour" },
    { id: 'rice', name: "Rice" },
    { id: 'vegetables', name: "Vegetables" },
    { id: 'fruits', name: "Fruits" },
    { id: 'spices', name: "Spices" },
    { id: 'oil', name: "Oil" },
    { id: 'dairy', name: "Dairy" },
    { id: 'meat', name: "Meat" },
    { id: 'poultry', name: "Poultry" },
    { id: 'seafood', name: "Seafood" }
  ];

  useEffect(() => {
    console.log('UserId from URL:', userId);
    if (userId) {
      fetchSellerData(userId);
    } else {
      console.error('No userId found in URL parameters');
      setShowProfileForm(true);
    }
  }, [userId]);

  const fetchSellerData = async (sellerId) => {
    try {
      // First try to get from your existing API
      const response = await fetch(`/api/raw-sellers/update/${sellerId}`);
      const data = await response.json();
      
      if (data.success && data.seller) {
        setSellerInfo(data.seller);
        setFormData({
          location: data.seller.location || {
            latitude: '',
            longitude: '',
            address: ''
          },
          availableMaterials: data.seller.availableMaterials || []
        });
        
        const isComplete = data.seller.location && 
                          data.seller.location.address && 
                          data.seller.availableMaterials && 
                          data.seller.availableMaterials.length > 0;
        
        setProfileComplete(isComplete);
        setShowProfileForm(!isComplete);
        updateDashboardStats(data.seller);
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setShowProfileForm(true);
    }
  };

  const updateDashboardStats = (sellerData) => {
    setDashboardStats([
      { 
        title: "Available Materials", 
        value: sellerData.availableMaterials?.length?.toString() || "0", 
        icon: <GiMeal className="text-2xl" />, 
        color: "bg-[#45DFB1]" 
      },
      { 
        title: "Location", 
        value: sellerData.location?.address ? "Set" : "Not set", 
        icon: <FaStore className="text-2xl" />, 
        color: "bg-[#80ED99]" 
      }
    ]);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.location.address.trim()) errors.address = 'Address is required';
      if (!formData.location.latitude || isNaN(formData.location.latitude)) {
        errors.latitude = 'Valid latitude is required';
      }
      if (!formData.location.longitude || isNaN(formData.location.longitude)) {
        errors.longitude = 'Valid longitude is required';
      }
    }
    
    if (step === 2) {
      if (formData.availableMaterials.length === 0) {
        errors.availableMaterials = 'Select at least one material';
      }
      
      formData.availableMaterials.forEach((material, index) => {
        if (!material.price || material.price <= 0) {
          errors[`price_${index}`] = 'Price must be greater than 0';
        }
        if (!material.quantityAvailable || material.quantityAvailable <= 0) {
          errors[`quantity_${index}`] = 'Quantity must be greater than 0';
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ 
        ...prev, 
        location: { 
          ...prev.location, 
          [field]: field === 'latitude' || field === 'longitude' ? parseFloat(value) || '' : value 
        } 
      }));
      
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleMaterialChange = (materialId, field, value) => {
    setFormData(prev => ({
      ...prev,
      availableMaterials: prev.availableMaterials.map(material =>
        material.materialId === materialId
          ? { ...material, [field]: field === 'price' || field === 'quantityAvailable' ? parseFloat(value) || 0 : value }
          : material
      )
    }));
  };

  const handleMultiSelect = (e, material) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      availableMaterials: checked 
        ? [...prev.availableMaterials, { 
            materialId: material.id, 
            materialName: material.name,
            price: 0, 
            quantityAvailable: 0 
          }]
        : prev.availableMaterials.filter(item => item.materialId !== material.id)
    }));
    
    if (formErrors.availableMaterials) {
      setFormErrors(prev => ({ ...prev, availableMaterials: undefined }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data for MongoDB (matching your database schema)
      const sellerDataForDB = {
        Name: sellerInfo?.name || `Seller_${userId}`,
        Email: sellerInfo?.email || `seller_${userId}@example.com`,
        Mobile: sellerInfo?.mobile || "0000000000",
        Locality: formData.location.address,
        Latitude: formData.location.latitude,
        Longitude: formData.location.longitude,
        Products: formData.availableMaterials.map(material => ({
          Product: material.materialName,
          Price_per_kg: material.price,
          Stock_quantity: material.quantityAvailable
        })),
        Rating: 4.0, // Default rating
        Verified: false // Default verification status
      };

      console.log('Submitting seller data:', sellerDataForDB);

      // Call your Flask backend API
      const response = await fetch('/api/register-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellerDataForDB),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        console.log('✅ Seller registered successfully:', result);
        
        // Update local state
        setShowProfileForm(false);
        setProfileComplete(true);
        
        // Refresh seller data
        await fetchSellerData(userId);
        
        alert('Profile saved successfully! Your information has been added to our database.');
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('❌ Error saving seller profile:', error);
      alert(`Failed to save profile: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeForm = () => {
    if (profileComplete) {
      setShowProfileForm(false);
    }
  };

  return (
    <div className="p-6 relative">
      {/* Blurred Dashboard Content when form is open */}
      <div className={showProfileForm ? 'blur-sm' : ''}>
        {profileComplete ? (
          <>
            {/* Animated Welcome Banner */}
            <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-[#213A57] to-[#0AD1C8] p-8 text-white">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">Your Raw Materials Dashboard</h1>
                <p className="text-xl opacity-90">"Manage your raw materials inventory and location"</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20">
                <GiFruitBowl className="text-[200px]" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {dashboardStats.map((stat, index) => (
                <div key={index} className={`${stat.color} text-white rounded-xl p-6 shadow-md hover:scale-[1.02] transition-transform`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-80">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-white bg-opacity-20">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#45DFB1]">
              <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
                <FaStore className="mr-2" /> Your Location
              </h2>
              {sellerInfo?.location ? (
                <div className="space-y-2">
                  <p className='text-black'><span className="font-medium">Address:</span> {sellerInfo.location.address}</p>
                  <p className='text-black'><span className="font-medium text-black">Coordinates:</span> {sellerInfo.location.latitude}, {sellerInfo.location.longitude}</p>
                </div>
              ) : (
                <p className="text-gray-500">No location information available</p>
              )}
              <button 
                onClick={() => {
                  setShowProfileForm(true);
                  setCurrentStep(1);
                }}
                className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center"
              >
                Update Location <span className="ml-1">→</span>
              </button>
            </div>

            {/* Available Materials */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#45DFB1]">
              <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
                <GiMeat className="mr-2" /> Your Available Materials
              </h2>
              {sellerInfo?.availableMaterials?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sellerInfo.availableMaterials.map((material, index) => {
                    const materialInfo = commonMaterials.find(m => m.id === material.materialId);
                    return (
                      <div key={index} className="bg-[#f0fdf4] p-4 rounded-lg border border-[#45DFB1]">
                        <p className="font-medium text-[#14919B] mb-2">
                          {materialInfo?.name || material.materialName || `Material ${material.materialId}`}
                        </p>
                        <p className="text-sm mb-1 text-black">Price: ₹{material.price}/kg</p>
                        <p className="text-sm text-black">Available: {material.quantityAvailable} kg</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No materials added yet</p>
              )}
              <button 
                onClick={() => {
                  setShowProfileForm(true);
                  setCurrentStep(2);
                }}
                className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center"
              >
                Update Materials <span className="ml-1">→</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[#213A57] mb-4">Please complete your profile to access the dashboard</h2>
            <button
              onClick={() => setShowProfileForm(true)}
              className="bg-[#0AD1C8] text-white py-2 px-6 rounded-md hover:bg-[#086477]"
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Completion Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#213A57]">
                  {currentStep === 1 ? 'Set Your Location' : 'Select Available Materials'}
                </h2>
                {profileComplete && (
                  <button
                    onClick={closeForm}
                    className="text-gray-500 hover:text-black"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-[#0AD1C8] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-[#0AD1C8]' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-[#0AD1C8] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Address *
                      </label>
                      <textarea
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AD1C8]"
                        rows="3"
                        required
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Latitude *
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="location.latitude"
                          value={formData.location.latitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 18.5204"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AD1C8]"
                          required
                        />
                        {formErrors.latitude && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.latitude}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Longitude *
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="location.longitude"
                          value={formData.location.longitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 73.8567"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AD1C8]"
                          required
                        />
                        {formErrors.longitude && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.longitude}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="mt-4 bg-[#0AD1C8] text-white py-2 px-6 rounded-md hover:bg-[#086477] flex items-center"
                      >
                        Next <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-4">
                        Select Available Materials *
                      </label>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {commonMaterials.map((material) => (
                          <label key={material.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={formData.availableMaterials.some(item => item.materialId === material.id)}
                              onChange={(e) => handleMultiSelect(e, material)}
                              className="rounded text-[#0AD1C8] focus:ring-[#0AD1C8]"
                            />
                            <span className="text-sm">{material.name}</span>
                          </label>
                        ))}
                      </div>
                      {formErrors.availableMaterials && (
                        <p className="text-red-500 text-sm">{formErrors.availableMaterials}</p>
                      )}
                    </div>

                    {/* Price and Quantity inputs for selected materials */}
                    {formData.availableMaterials.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-black">Set Price and Quantity:</h3>
                        {formData.availableMaterials.map((material, index) => {
                          const materialInfo = commonMaterials.find(m => m.id === material.materialId);
                          return (
                            <div key={material.materialId} className="p-4 border rounded-md bg-gray-50">
                              <h4 className="font-medium mb-3">{materialInfo?.name}</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">Price per kg (₹)</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={material.price}
                                    onChange={(e) => handleMaterialChange(material.materialId, 'price', e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AD1C8]"
                                    placeholder="0.00"
                                  />
                                  {formErrors[`price_${index}`] && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors[`price_${index}`]}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm text-gray-600 mb-1">Available Quantity (kg)</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={material.quantityAvailable}
                                    onChange={(e) => handleMaterialChange(material.materialId, 'quantityAvailable', e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AD1C8]"
                                    placeholder="0.00"
                                  />
                                  {formErrors[`quantity_${index}`] && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors[`quantity_${index}`]}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="mt-4 bg-gray-200 text-black py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
                      >
                        <FaArrowLeft className="mr-2" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 bg-[#45DFB1] text-white py-2 px-6 rounded-md hover:bg-[#14919B] flex items-center disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;