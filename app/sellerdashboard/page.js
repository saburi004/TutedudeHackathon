'use client';
import { useState, useEffect } from 'react';
import { 
  FaChartLine, FaCertificate, FaClipboardCheck, FaStore, 
  FaUtensils, FaArrowRight, FaArrowLeft, FaUser 
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiMeat } from 'react-icons/gi';

// Dashboard data
const dashboardStats = [
  { title: "Monthly Revenue", value: "$4,820", icon: <FaChartLine className="text-2xl" />, color: "bg-[#0AD1C8]" },
  { title: "Active Products", value: "18", icon: <GiMeal className="text-2xl" />, color: "bg-[#45DFB1]" },
  { title: "Total Orders", value: "156", icon: <FaStore className="text-2xl" />, color: "bg-[#80ED99]" },
  { title: "Avg. Rating", value: "4.7/5", icon: <FaClipboardCheck className="text-2xl" />, color: "bg-[#14919B]" }
];

const sampleCertificates = [
  { id: 1, title: "Food Hygiene Certificate", expiry: "2024-12-31" },
  { id: 2, title: "Organic Certification", expiry: "2025-06-30" }
];

const sampleReviews = [
  { id: 1, rating: 5, comment: "Excellent quality produce!", customer: "John D.", date: "2023-11-15" },
  { id: 2, rating: 4, comment: "Fresh and delicious", customer: "Sarah M.", date: "2023-11-10" }
];

export default function SellerDashboardPage() {
  const [profileComplete, setProfileComplete] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    shopLocation: '',
    ingredients: [],
    businessType: '',
    certifications: [],
    deliveryAreas: [],
    businessHours: { open: '', close: '' }
  });

  useEffect(() => {
    // Check localStorage for saved profile
    const savedProfile = localStorage.getItem('sellerProfile');
    const savedCompletionStatus = localStorage.getItem('profileComplete');
    
    if (savedProfile && savedCompletionStatus === 'true') {
      setFormData(JSON.parse(savedProfile));
      setProfileComplete(true);
    } else {
      setShowProfileForm(true);
    }
  }, []);

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
      if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
      if (!formData.shopLocation.trim()) errors.shopLocation = 'Shop location is required';
    }
    
    if (step === 2) {
      if (!formData.businessType) errors.businessType = 'Business type is required';
      if (formData.ingredients.length === 0) errors.ingredients = 'Select at least one ingredient';
    }
    
    if (step === 3) {
      if (!formData.businessHours.open) errors.businessHours = 'Opening time is required';
      if (!formData.businessHours.close) errors.businessHours = 'Closing time is required';
      if (formData.deliveryAreas.length === 0) errors.deliveryAreas = 'Select at least one delivery area';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiSelect = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
    // Clear error when field is edited
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Save to localStorage
      localStorage.setItem('sellerProfile', JSON.stringify(formData));
      localStorage.setItem('profileComplete', 'true');
      
      setProfileComplete(true);
      setShowProfileForm(false);
    }
  };

  return (
    <div className="p-6 relative">
      {/* Blurred Dashboard Content when form is open */}
      <div className={showProfileForm ? 'blur-sm' : ''}>
          <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-[#213A57] to-[#0AD1C8] p-8 text-white">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2 animate-pulse">Welcome to FoodChain Seller Portal!</h1>
                <p className="text-xl opacity-90">"Showcase your quality food products to thousands of buyers"</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20">
                <FaUtensils className="text-[200px]" />
              </div>
            </div>

        {/* Only show dashboard content if profile is complete */}
        {profileComplete && (
          <>
            {/* Animated Welcome Banner */}
          
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Hygiene Certificates */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#45DFB1]">
              <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
                <FaCertificate className="mr-2" /> Hygiene Certificates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleCertificates.map(cert => (
                  <div key={cert.id} className="p-4 border border-[#80ED99] rounded-lg hover:shadow-md transition">
                    <h3 className="font-bold text-[#213A57]">{cert.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Expires: {cert.expiry}</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-sm bg-[#0AD1C8] text-white py-1 px-3 rounded hover:bg-[#086477] transition">
                        View
                      </button>
                      <button className="text-sm bg-[#f0fdf4] text-[#0AD1C8] py-1 px-3 rounded hover:bg-[#0AD1C8] hover:text-white transition">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center">
                Upload New Certificate <span className="ml-1">→</span>
              </button>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#45DFB1]">
              <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
                <FaClipboardCheck className="mr-2" /> Recent Customer Reviews
              </h2>
              <div className="space-y-4">
                {sampleReviews.map(review => (
                  <div key={review.id} className="p-4 border border-[#f0fdf4] rounded-lg hover:bg-[#f0fdf4] transition">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-1">"{review.comment}"</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>- {review.customer}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center">
                View All Reviews <span className="ml-1">→</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Profile Completion Modal - only show if profile isn't complete */}
      {!profileComplete && showProfileForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-2xl font-bold text-[#213A57] mb-6 flex items-center">
                <FaUser className="mr-2" /> Complete Your Seller Profile
              </h2>
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                      required
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                      required
                    />
                    {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location*</label>
                    <input
                      type="text"
                      name="shopLocation"
                      value={formData.shopLocation}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${formErrors.shopLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                      required
                    />
                    {formErrors.shopLocation && <p className="text-red-500 text-xs mt-1">{formErrors.shopLocation}</p>}
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
              
              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type*</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full p-2 border ${formErrors.businessType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                      required
                    >
                      <option value="">Select your business type</option>
                      <option value="farm">Farm/Fishery</option>
                      <option value="bakery">Bakery</option>
                      <option value="dairy">Dairy Products</option>
                      <option value="meat">Meat/Poultry</option>
                      <option value="processed">Processed Foods</option>
                    </select>
                    {formErrors.businessType && <p className="text-red-500 text-xs mt-1">{formErrors.businessType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients You Sell*</label>
                    {formErrors.ingredients && <p className="text-red-500 text-xs mb-1">{formErrors.ingredients}</p>}
                    <div className="space-y-2">
                      {['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Seafood', 'Herbs', 'Spices'].map(item => (
                        <div key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`ingredient-${item}`}
                            value={item}
                            checked={formData.ingredients.includes(item)}
                            onChange={(e) => handleMultiSelect(e, 'ingredients')}
                            className="h-4 w-4 text-[#0AD1C8] focus:ring-[#0AD1C8] border-gray-300 rounded"
                          />
                          <label htmlFor={`ingredient-${item}`} className="ml-2 text-sm text-gray-700">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="mt-4 bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
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
              
              {/* Step 3: Business Operations */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours*</label>
                    {formErrors.businessHours && <p className="text-red-500 text-xs mb-1">Please set both opening and closing times</p>}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Open</label>
                        <input
                          type="time"
                          name="businessHours.open"
                          value={formData.businessHours.open}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessHours: { ...prev.businessHours, open: e.target.value }
                          }))}
                          className={`w-full p-2 border ${formErrors.businessHours ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Close</label>
                        <input
                          type="time"
                          name="businessHours.close"
                          value={formData.businessHours.close}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessHours: { ...prev.businessHours, close: e.target.value }
                          }))}
                          className={`w-full p-2 border ${formErrors.businessHours ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Areas*</label>
                    {formErrors.deliveryAreas && <p className="text-red-500 text-xs mb-1">{formErrors.deliveryAreas}</p>}
                    <div className="space-y-2">
                      {['Local', 'Regional', 'National', 'International'].map(item => (
                        <div key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`delivery-${item}`}
                            value={item}
                            checked={formData.deliveryAreas.includes(item)}
                            onChange={(e) => handleMultiSelect(e, 'deliveryAreas')}
                            className="h-4 w-4 text-[#0AD1C8] focus:ring-[#0AD1C8] border-gray-300 rounded"
                          />
                          <label htmlFor={`delivery-${item}`} className="ml-2 text-sm text-gray-700">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (optional)</label>
                    <div className="space-y-2">
                      {['Organic', 'Halal', 'Kosher', 'FDA Approved', 'ISO Certified', 'HACCP'].map(item => (
                        <div key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cert-${item}`}
                            value={item}
                            checked={formData.certifications.includes(item)}
                            onChange={(e) => handleMultiSelect(e, 'certifications')}
                            className="h-4 w-4 text-[#0AD1C8] focus:ring-[#0AD1C8] border-gray-300 rounded"
                          />
                          <label htmlFor={`cert-${item}`} className="ml-2 text-sm text-gray-700">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="mt-4 bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                      type="submit"
                      className="mt-4 bg-[#45DFB1] text-white py-2 px-6 rounded-md hover:bg-[#14919B] flex items-center"
                    >
                      Complete Profile
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}