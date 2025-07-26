
// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { 
// //   FaChartLine, FaHistory, FaBell, FaUtensilSpoon, 
// //   FaChartPie, FaShoppingBag, FaUsers, FaUser,
// //   FaPhone, FaMapMarkerAlt, FaArrowRight, FaArrowLeft
// // } from 'react-icons/fa';
// // import { GiMeal, GiFruitBowl, GiMeat, GiMilkCarton, GiBread } from 'react-icons/gi';

// // export default function BuyerDashboardPage() {
// //   const [profileComplete, setProfileComplete] = useState(false);
// //   const [showProfileForm, setShowProfileForm] = useState(false);
// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [formErrors, setFormErrors] = useState({});
  
// //   // Form data state
// //   const [formData, setFormData] = useState({
// //     fullName: '',
// //     phoneNumber: '',
// //     location: '',
// //     businessName: '',
// //     businessType: '',
// //     productsNeeded: [],
// //     deliveryPreferences: '',
// //     paymentMethods: []
// //   });

// //   // Sample analytics data
// //   const analytics = [
// //     { title: "Monthly Spend", value: "$8,420", change: "+12%", icon: <FaChartPie className="text-2xl" />, color: "bg-[#0AD1C8]" },
// //     { title: "Active Orders", value: "15", change: "+5%", icon: <FaShoppingBag className="text-2xl" />, color: "bg-[#45DFB1]" },
// //     { title: "Favorite Sellers", value: "8", change: "+2", icon: <FaUsers className="text-2xl" />, color: "bg-[#80ED99]" },
// //     { title: "Avg. Rating", value: "4.8/5", change: "+0.2", icon: <FaChartLine className="text-2xl" />, color: "bg-[#14919B]" }
// //   ];

// //   const businessTypes = [
// //     'Restaurant', 'Cafe', 'Grocery Store', 
// //     'Food Truck', 'Hotel', 'Catering Service', 'Other'
// //   ];

// //   const productCategories = [
// //     { name: 'Fruits & Vegetables', icon: <GiFruitBowl /> },
// //     { name: 'Meat & Poultry', icon: <GiMeat /> },
// //     { name: 'Dairy Products', icon: <GiMilkCarton /> },
// //     { name: 'Bakery Items', icon: <GiBread /> },
// //     { name: 'Seafood', icon: <GiMeat /> },
// //     { name: 'Beverages', icon: <GiMilkCarton /> }
// //   ];

// //   const paymentOptions = [
// //     'Cash on Delivery', 'Bank Transfer', 
// //     'Credit Card', 'Mobile Payment', 'Online Payment'
// //   ];

// //   useEffect(() => {
// //     const savedProfile = localStorage.getItem('buyerProfile');
// //     const isComplete = localStorage.getItem('buyerProfileComplete') === 'true';
    
// //     if (isComplete && savedProfile) {
// //       setFormData(JSON.parse(savedProfile));
// //       setProfileComplete(true);
// //     } else {
// //       setShowProfileForm(true);
// //     }
// //   }, []);

// //   const validateStep = (step) => {
// //     const errors = {};
    
// //     if (step === 1) {
// //       if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
// //       if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
// //       if (!formData.location.trim()) errors.location = 'Location is required';
// //     }
    
// //     if (step === 2) {
// //       if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
// //       if (!formData.businessType) errors.businessType = 'Business type is required';
// //     }
    
// //     if (step === 3) {
// //       if (formData.productsNeeded.length === 0) errors.productsNeeded = 'Select at least one product category';
// //       if (!formData.deliveryPreferences) errors.deliveryPreferences = 'Delivery preference is required';
// //     }
    
// //     setFormErrors(errors);
// //     return Object.keys(errors).length === 0;
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //     if (formErrors[name]) {
// //       setFormErrors(prev => ({ ...prev, [name]: undefined }));
// //     }
// //   };

// //   const handleMultiSelect = (e, field) => {
// //     const { value, checked } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [field]: checked 
// //         ? [...prev[field], value]
// //         : prev[field].filter(item => item !== value)
// //     }));
// //     if (formErrors[field]) {
// //       setFormErrors(prev => ({ ...prev, [field]: undefined }));
// //     }
// //   };

// //   const nextStep = () => {
// //     if (validateStep(currentStep)) {
// //       setCurrentStep(prev => prev + 1);
// //     }
// //   };

// //   const prevStep = () => setCurrentStep(prev => prev - 1);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (validateStep(currentStep)) {
// //       localStorage.setItem('buyerProfile', JSON.stringify(formData));
// //       localStorage.setItem('buyerProfileComplete', 'true');
// //       setProfileComplete(true);
// //       setShowProfileForm(false);
// //     }
// //   };

// //   return (
// //     <div className="p-6 relative">
// //       {/* Blurred Dashboard Content when form is open */}
// //       <div className={showProfileForm ? 'blur-sm' : ''}>
// //           <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-[#213A57] to-[#0AD1C8] p-8 text-white">
// //               <div className="relative z-10">
// //                 <h1 className="text-4xl font-bold mb-2 animate-pulse">Welcome to FoodChain Buyer Portal!</h1>
// //                 <p className="text-xl opacity-90">"Find quality food suppliers for your business"</p>
// //               </div>
// //               <div className="absolute -right-10 -bottom-10 opacity-20">
// //                 <FaUtensilSpoon className="text-[200px]" />
// //               </div>
// //             </div>
// //         {/* Only show dashboard content if profile is complete */}
// //         {profileComplete && (
// //           <>
// //             {/* Animated Welcome Banner */}
          

// //             {/* Stats Cards */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //               {analytics.map((stat, index) => (
// //                 <div key={index} className={`${stat.color} text-white rounded-xl p-6 shadow-md hover:scale-[1.02] transition-transform`}>
// //                   <div className="flex justify-between items-center">
// //                     <div>
// //                       <p className="text-sm opacity-80">{stat.title}</p>
// //                       <p className="text-2xl font-bold mt-1">{stat.value}</p>
// //                       <p className="text-sm mt-2 opacity-90">{stat.change} from last month</p>
// //                     </div>
// //                     <div className="p-3 rounded-full bg-white bg-opacity-20">
// //                       {stat.icon}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Recent Activity */}
// //             <div className="bg-white rounded-xl shadow-md p-6 border border-[#45DFB1]">
// //               <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
// //                 <FaHistory className="mr-2" /> Recent Activity
// //               </h2>
// //               <div className="space-y-4">
// //                 {[
// //                   { id: 1, action: "New order placed", details: "20kg Organic Apples", time: "2 hours ago", icon: <GiFruitBowl /> },
// //                   { id: 2, action: "Payment completed", details: "$524.80 to Fresh Farms", time: "1 day ago", icon: <FaShoppingBag /> },
// //                   { id: 3, action: "New seller favorited", details: "Quality Meats Co.", time: "3 days ago", icon: <FaUsers /> }
// //                 ].map((activity) => (
// //                   <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-[#f0fdf4] rounded-lg transition">
// //                     <div className="p-3 rounded-full bg-[#0AD1C8] bg-opacity-20 text-[#0AD1C8] mt-1">
// //                       {activity.icon}
// //                     </div>
// //                     <div className="flex-1">
// //                       <h3 className="font-medium text-[#213A57]">{activity.action}</h3>
// //                       <p className="text-sm text-gray-500">{activity.details}</p>
// //                     </div>
// //                     <span className="text-sm text-gray-400">{activity.time}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center">
// //                 View all activity <span className="ml-1">→</span>
// //               </button>
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* Profile Completion Modal */}
// //       {!profileComplete && showProfileForm && (
// //         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //             <form onSubmit={handleSubmit} className="p-6">
// //               <h2 className="text-2xl font-bold text-[#213A57] mb-6 flex items-center">
// //                 <FaUser className="mr-2" /> Complete Your Buyer Profile
// //               </h2>
              
// //               {/* Step 1: Personal Information */}
// //               {currentStep === 1 && (
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
// //                       <FaUser className="mr-2" /> Full Name*
// //                     </label>
// //                     <input
// //                       type="text"
// //                       name="fullName"
// //                       value={formData.fullName}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                       placeholder="Your full name"
// //                     />
// //                     {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
// //                   </div>
                  
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
// //                       <FaPhone className="mr-2" /> Phone Number*
// //                     </label>
// //                     <input
// //                       type="tel"
// //                       name="phoneNumber"
// //                       value={formData.phoneNumber}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                       placeholder="Your contact number"
// //                     />
// //                     {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
// //                   </div>
                  
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
// //                       <FaMapMarkerAlt className="mr-2" /> Business Location*
// //                     </label>
// //                     <input
// //                       type="text"
// //                       name="location"
// //                       value={formData.location}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                       placeholder="Where your business is located"
// //                     />
// //                     {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
// //                   </div>
                  
// //                   <div className="flex justify-end">
// //                     <button
// //                       type="button"
// //                       onClick={nextStep}
// //                       className="mt-4 bg-[#0AD1C8] text-white py-2 px-6 rounded-md hover:bg-[#086477] flex items-center"
// //                     >
// //                       Next <FaArrowRight className="ml-2" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
              
// //               {/* Step 2: Business Information */}
// //               {currentStep === 2 && (
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Business Name*</label>
// //                     <input
// //                       type="text"
// //                       name="businessName"
// //                       value={formData.businessName}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                       placeholder="Your business name"
// //                     />
// //                     {formErrors.businessName && <p className="text-red-500 text-xs mt-1">{formErrors.businessName}</p>}
// //                   </div>
                  
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Business Type*</label>
// //                     <select
// //                       name="businessType"
// //                       value={formData.businessType}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.businessType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                     >
// //                       <option value="">Select your business type</option>
// //                       {businessTypes.map((type, index) => (
// //                         <option key={index} value={type}>{type}</option>
// //                       ))}
// //                     </select>
// //                     {formErrors.businessType && <p className="text-red-500 text-xs mt-1">{formErrors.businessType}</p>}
// //                   </div>
                  
// //                   <div className="flex justify-between">
// //                     <button
// //                       type="button"
// //                       onClick={prevStep}
// //                       className="mt-4 bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
// //                     >
// //                       <FaArrowLeft className="mr-2" /> Back
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={nextStep}
// //                       className="mt-4 bg-[#0AD1C8] text-white py-2 px-6 rounded-md hover:bg-[#086477] flex items-center"
// //                     >
// //                       Next <FaArrowRight className="ml-2" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
              
// //               {/* Step 3: Buying Preferences */}
// //               {currentStep === 3 && (
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Products You Need*</label>
// //                     {formErrors.productsNeeded && <p className="text-red-500 text-xs mb-1">{formErrors.productsNeeded}</p>}
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       {productCategories.map((product, index) => (
// //                         <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
// //                           <input
// //                             type="checkbox"
// //                             id={`product-${index}`}
// //                             value={product.name}
// //                             checked={formData.productsNeeded.includes(product.name)}
// //                             onChange={(e) => handleMultiSelect(e, 'productsNeeded')}
// //                             className="h-4 w-4 text-[#0AD1C8] focus:ring-[#0AD1C8] border-gray-300 rounded"
// //                           />
// //                           <label htmlFor={`product-${index}`} className="ml-3 flex items-center">
// //                             <span className="mr-2">{product.icon}</span>
// //                             <span className="text-sm text-gray-700">{product.name}</span>
// //                           </label>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
                  
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Preferences*</label>
// //                     <select
// //                       name="deliveryPreferences"
// //                       value={formData.deliveryPreferences}
// //                       onChange={handleInputChange}
// //                       className={`w-full p-2 border ${formErrors.deliveryPreferences ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0AD1C8]`}
// //                     >
// //                       <option value="">Select delivery preference</option>
// //                       <option value="daily">Daily Delivery</option>
// //                       <option value="weekly">Weekly Delivery</option>
// //                       <option value="biweekly">Bi-weekly Delivery</option>
// //                       <option value="monthly">Monthly Delivery</option>
// //                       <option value="as_needed">As Needed</option>
// //                     </select>
// //                     {formErrors.deliveryPreferences && <p className="text-red-500 text-xs mt-1">{formErrors.deliveryPreferences}</p>}
// //                   </div>
                  
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Methods</label>
// //                     <div className="space-y-2">
// //                       {paymentOptions.map((option, index) => (
// //                         <div key={index} className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             id={`payment-${index}`}
// //                             value={option}
// //                             checked={formData.paymentMethods.includes(option)}
// //                             onChange={(e) => handleMultiSelect(e, 'paymentMethods')}
// //                             className="h-4 w-4 text-[#0AD1C8] focus:ring-[#0AD1C8] border-gray-300 rounded"
// //                           />
// //                           <label htmlFor={`payment-${index}`} className="ml-2 text-sm text-gray-700">
// //                             {option}
// //                           </label>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
                  
// //                   <div className="flex justify-between">
// //                     <button
// //                       type="button"
// //                       onClick={prevStep}
// //                       className="mt-4 bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
// //                     >
// //                       <FaArrowLeft className="mr-2" /> Back
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       className="mt-4 bg-[#45DFB1] text-white py-2 px-6 rounded-md hover:bg-[#14919B] flex items-center"
// //                     >
// //                       Complete Profile
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // BuyerDashboardPage.jsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { FaUtensils, FaChartLine, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

// export default function BuyerDashboardPage() {
//   const [sellerData, setSellerData] = useState(null);
//   const [formData, setFormData] = useState({
//     location: {
//       address: '',
//       coordinates: {
//         latitude: 0,
//         longitude: 0
//       }
//     },
//     foodItems: [''],
//     totalDishesMade: 0,
//     totalDishesServed: 0,
//     dailyPrepared: 0,
//     dailySold: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId');

//   useEffect(() => {
//     if (userId) {
//       fetchSellerData();
//     }
//   }, [userId]);

//   const fetchSellerData = async () => {
//     try {
//       const response = await fetch(`/api/street-sellers/update/${userId}`);
//       const data = await response.json();
//       if (data.success) {
//         setSellerData(data.seller);
//         if (data.seller.businessDetails) {
//           setFormData({
//             location: data.seller.businessDetails.location || { address: '', coordinates: { latitude: 0, longitude: 0 } },
//             foodItems: data.seller.businessDetails.foodItems || [''],
//             totalDishesMade: data.seller.businessDetails.operationDetails?.totalDishesMade || 0,
//             totalDishesServed: data.seller.businessDetails.operationDetails?.totalDishesServed || 0,
//             dailyPrepared: 0,
//             dailySold: 0
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching seller data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       if (name.includes('.')) {
//         const [parent, child] = name.split('.');
//         return {
//           ...prev,
//           [parent]: {
//             ...prev[parent],
//             [child]: value
//           }
//         };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   const handleFoodItemChange = (index, value) => {
//     const newFoodItems = [...formData.foodItems];
//     newFoodItems[index] = value;
//     setFormData(prev => ({ ...prev, foodItems: newFoodItems }));
//   };

//   const addFoodItem = () => {
//     setFormData(prev => ({ ...prev, foodItems: [...prev.foodItems, ''] }));
//   };

//   const removeFoodItem = (index) => {
//     const newFoodItems = formData.foodItems.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, foodItems: newFoodItems }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/api/street-sellers/update/${userId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           businessDetails: {
//             location: formData.location,
//             foodItems: formData.foodItems,
//             operationDetails: {
//               totalDishesMade: formData.totalDishesMade,
//               totalDishesServed: formData.totalDishesServed,
//               dailyRecords: [{
//                 date: new Date(),
//                 prepared: formData.dailyPrepared,
//                 sold: formData.dailySold
//               }]
//             }
//           }
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         setSellerData(data.seller);
//         setEditing(false);
//         // Trigger a re-fetch to ensure we have the latest data
//         fetchSellerData();
//       }
//     } catch (error) {
//       console.error('Error updating seller data:', error);
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6">
//       {!sellerData?.businessDetails || editing ? (
//         // Edit Form
//         <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//           <h2 className="text-2xl font-bold mb-6 flex items-center">
//             <FaUtensils className="mr-2" /> Business Details
//           </h2>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block font-medium mb-2 flex items-center">
//                 <FaMapMarkerAlt className="mr-2" /> Business Location
//               </label>
//               <input
//                 type="text"
//                 name="location.address"
//                 value={formData.location.address}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Street address"
//                 required
//               />
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <input
//                   type="number"
//                   name="location.coordinates.latitude"
//                   value={formData.location.coordinates.latitude}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Latitude"
//                   step="any"
//                 />
//                 <input
//                   type="number"
//                   name="location.coordinates.longitude"
//                   value={formData.location.coordinates.longitude}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Longitude"
//                   step="any"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-medium mb-2">Food Items</label>
//               {formData.foodItems.map((item, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <input
//                     type="text"
//                     value={item}
//                     onChange={(e) => handleFoodItemChange(index, e.target.value)}
//                     className="flex-1 p-2 border border-gray-300 rounded-md"
//                     placeholder="Food item name"
//                     required
//                   />
//                   {formData.foodItems.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeFoodItem(index)}
//                       className="ml-2 p-2 text-red-500"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addFoodItem}
//                 className="mt-2 text-sm text-blue-500 hover:text-blue-700"
//               >
//                 + Add another food item
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block font-medium mb-2">Total Dishes Made</label>
//                 <input
//                   type="number"
//                   name="totalDishesMade"
//                   value={formData.totalDishesMade}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-2">Total Dishes Served</label>
//                 <input
//                   type="number"
//                   name="totalDishesServed"
//                   value={formData.totalDishesServed}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   min="0"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block font-medium mb-2">Today's Prepared</label>
//                 <input
//                   type="number"
//                   name="dailyPrepared"
//                   value={formData.dailyPrepared}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block font-medium mb-2">Today's Sold</label>
//                 <input
//                   type="number"
//                   name="dailySold"
//                   value={formData.dailySold}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   min="0"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-4">
//               {sellerData?.businessDetails && (
//                 <button
//                   type="button"
//                   onClick={() => setEditing(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md"
//                 >
//                   Cancel
//                 </button>
//               )}
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//               >
//                 Save Details
//               </button>
//             </div>
//           </form>
//         </div>
//       ) : (
//         // Display Mode
//         <div className="max-w-4xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">{sellerData.name}'s Dashboard</h1>
//             <button
//               onClick={() => setEditing(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Edit Details
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FaMapMarkerAlt className="mr-2" /> Location
//               </h2>
//               <p>{sellerData.businessDetails.location.address}</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Lat: {sellerData.businessDetails.location.coordinates.latitude}, 
//                 Lng: {sellerData.businessDetails.location.coordinates.longitude}
//               </p>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FaUtensils className="mr-2" /> Food Items
//               </h2>
//               <ul className="list-disc pl-5">
//                 {sellerData.businessDetails.foodItems.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FaChartLine className="mr-2" /> Production Stats
//               </h2>
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Total Dishes Made</p>
//                   <p className="text-2xl font-bold">
//                     {sellerData.businessDetails.operationDetails.totalDishesMade}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Dishes Served</p>
//                   <p className="text-2xl font-bold">
//                     {sellerData.businessDetails.operationDetails.totalDishesServed}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FaHistory className="mr-2" /> Daily Records
//               </h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-2">Date</th>
//                       <th className="text-left py-2">Prepared</th>
//                       <th className="text-left py-2">Sold</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sellerData.businessDetails.operationDetails.dailyRecords
//                       .slice().reverse().slice(0, 5).map((record, index) => (
//                         <tr key={index} className="border-b">
//                           <td className="py-2">
//                             {new Date(record.date).toLocaleDateString()}
//                           </td>
//                           <td className="py-2">{record.prepared}</td>
//                           <td className="py-2">{record.sold}</td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaUtensils, FaChartLine, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

export default function BuyerDashboardPage() {
  const [sellerData, setSellerData] = useState(null);
  const [formData, setFormData] = useState({
    location: {
      address: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    foodItems: [''],
    totalDishesMade: 0,
    totalDishesServed: 0,
    dailyPrepared: 0,
    dailySold: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (userId) {
      fetchSellerData();
    }
  }, [userId, submitSuccess]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/street-sellers/update/${userId}`);
      const data = await response.json();
      if (data.success) {
        setSellerData(data.seller);
        if (data.seller.businessDetails) {
          setFormData({
            location: data.seller.businessDetails.location || { address: '', coordinates: { latitude: 0, longitude: 0 } },
            foodItems: data.seller.businessDetails.foodItems || [''],
            totalDishesMade: data.seller.businessDetails.operationDetails?.totalDishesMade || 0,
            totalDishesServed: data.seller.businessDetails.operationDetails?.totalDishesServed || 0,
            dailyPrepared: 0,
            dailySold: 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFoodItemChange = (index, value) => {
    const newFoodItems = [...formData.foodItems];
    newFoodItems[index] = value;
    setFormData(prev => ({ ...prev, foodItems: newFoodItems }));
  };

  const addFoodItem = () => {
    setFormData(prev => ({ ...prev, foodItems: [...prev.foodItems, ''] }));
  };

  const removeFoodItem = (index) => {
    const newFoodItems = formData.foodItems.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, foodItems: newFoodItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/street-sellers/update/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessDetails: {
            location: formData.location,
            foodItems: formData.foodItems,
            operationDetails: {
              totalDishesMade: formData.totalDishesMade,
              totalDishesServed: formData.totalDishesServed,
              dailyRecords: [{
                date: new Date(),
                prepared: formData.dailyPrepared,
                sold: formData.dailySold
              }]
            }
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(prev => !prev);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating seller data:', error);
    }
  };

  if (loading) return <div className="p-6 text-black">Loading...</div>;

  const showForm = editing || !sellerData?.businessDetails;

  return (
    <div className="p-6">
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaUtensils className="mr-2" /> Business Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Business Location
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Street address"
                required
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <input
                  type="number"
                  name="location.coordinates.latitude"
                  value={formData.location.coordinates.latitude}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Latitude"
                  step="any"
                />
                <input
                  type="number"
                  name="location.coordinates.longitude"
                  value={formData.location.coordinates.longitude}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Longitude"
                  step="any"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Food Items</label>
              {formData.foodItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleFoodItemChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Food item name"
                    required
                  />
                  {formData.foodItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFoodItem(index)}
                      className="ml-2 p-2 text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFoodItem}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                + Add another food item
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Total Dishes Made</label>
                <input
                  type="number"
                  name="totalDishesMade"
                  value={formData.totalDishesMade}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Total Dishes Served</label>
                <input
                  type="number"
                  name="totalDishesServed"
                  value={formData.totalDishesServed}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Today's Prepared</label>
                <input
                  type="number"
                  name="dailyPrepared"
                  value={formData.dailyPrepared}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Today's Sold</label>
                <input
                  type="number"
                  name="dailySold"
                  value={formData.dailySold}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {sellerData?.businessDetails && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{sellerData.name}'s Dashboard</h1>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Location
              </h2>
              <p>{sellerData.businessDetails.location.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                Lat: {sellerData.businessDetails.location.coordinates.latitude}, 
                Lng: {sellerData.businessDetails.location.coordinates.longitude}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaUtensils className="mr-2" /> Food Items
              </h2>
              <ul className="list-disc pl-5">
                {sellerData.businessDetails.foodItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaChartLine className="mr-2" /> Production Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Dishes Made</p>
                  <p className="text-2xl font-bold">
                    {sellerData.businessDetails.operationDetails.totalDishesMade}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Dishes Served</p>
                  <p className="text-2xl font-bold">
                    {sellerData.businessDetails.operationDetails.totalDishesServed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaHistory className="mr-2" /> Daily Records
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Prepared</th>
                      <th className="text-left py-2">Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerData.businessDetails.operationDetails.dailyRecords
                      .slice().reverse().slice(0, 5).map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="py-2">{record.prepared}</td>
                          <td className="py-2">{record.sold}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}