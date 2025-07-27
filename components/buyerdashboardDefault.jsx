// app/buyerdashboard/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaUtensils, FaChartLine, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

export default function BuyerDashboard() {
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
    totalDishesServed: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (userId) {
      fetchSellerData();
    }
  }, [userId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/street-sellers/update/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      if (data.success) {
        setSellerData(data.seller);
        if (data.seller.businessDetails) {
          setFormData({
            location: data.seller.businessDetails.location || { 
              address: '', 
              coordinates: { latitude: 0, longitude: 0 } 
            },
            foodItems: data.seller.businessDetails.foodItems || [''],
            totalDishesMade: data.seller.businessDetails.operationDetails?.totalDishesMade || 0,
            totalDishesServed: data.seller.businessDetails.operationDetails?.totalDishesServed || 0
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessDetails: {
            location: formData.location,
            foodItems: formData.foodItems,
            operationDetails: {
              totalDishesMade: formData.totalDishesMade,
              totalDishesServed: formData.totalDishesServed
            }
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setSellerData(data.seller);
        setEditing(false);
        fetchSellerData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating seller data:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const showForm = editing || !sellerData?.businessDetails;

  return (
    <div className="p-6">
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaUtensils className="mr-2" /> Business Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
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
                      ?.slice()
                      ?.reverse()
                      ?.slice(0, 5)
                      ?.map((record, index) => (
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