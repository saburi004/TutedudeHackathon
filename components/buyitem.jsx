'use client';
// import DashboardLayout from './buyerDashboard';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const BuyItems = () => {
  // Dummy data for sellers and their items
  const sellers = [
    {
      id: 1,
      name: "Organic Farm Fresh",
      rating: 4.8,
      items: [
        { id: 1, name: "Fresh Apples", price: "$2.99/kg", category: "Fruits" },
        { id: 2, name: "Organic Carrots", price: "$1.49/kg", category: "Vegetables" },
        { id: 3, name: "Free-range Eggs", price: "$4.99/dozen", category: "Dairy" },
      ],
      image: "/images/farmer1.jpg"
    },
    {
      id: 2,
      name: "Bakery Delights",
      rating: 4.6,
      items: [
        { id: 4, name: "Sourdough Bread", price: "$5.99/loaf", category: "Bakery" },
        { id: 5, name: "Croissants", price: "$2.50/each", category: "Bakery" },
        { id: 6, name: "Chocolate Cake", price: "$24.99/whole", category: "Desserts" },
      ],
      image: "/images/bakery1.jpg"
    },
    {
      id: 3,
      name: "Seafood Market",
      rating: 4.7,
      items: [
        { id: 7, name: "Fresh Salmon", price: "$12.99/lb", category: "Seafood" },
        { id: 8, name: "Shrimp", price: "$9.99/lb", category: "Seafood" },
        { id: 9, name: "Oysters", price: "$1.50/each", category: "Seafood" },
      ],
      image: "/images/seafood1.jpg"
    }
  ];

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#213A57] mb-6 flex items-center">
          <FaShoppingCart className="mr-2" /> Buy Food Items
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
            <div key={seller.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#45DFB1]">
              <div className="bg-[#14919B] p-4 text-white">
                <h2 className="text-xl font-semibold">{seller.name}</h2>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-300 mr-1" />
                  <span>{seller.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-[#086477] mb-3">Available Items:</h3>
                <ul className="space-y-3">
                  {seller.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border-b border-[#80ED99] pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <span className="font-bold text-[#0AD1C8]">{item.price}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="mt-4 w-full bg-[#0AD1C8] hover:bg-[#086477] text-white py-2 px-4 rounded-lg transition duration-200">
                  View Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default BuyItems;