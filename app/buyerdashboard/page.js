'use client';
import { FaChartLine, FaHistory, FaBell, FaUtensilSpoon, FaChartPie, FaShoppingBag, FaUsers } from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiMeat } from 'react-icons/gi';

export default function DashboardPage() {
  // Sample analytics data
  const analytics = [
    { title: "Total Revenue", value: "$8,420", change: "+12%", icon: <FaChartPie className="text-2xl" />, color: "bg-[#0AD1C8]" },
    { title: "Active Users", value: "1,243", change: "+5%", icon: <FaUsers className="text-2xl" />, color: "bg-[#45DFB1]" },
    { title: "New Orders", value: "156", change: "+8%", icon: <FaShoppingBag className="text-2xl" />, color: "bg-[#80ED99]" },
    { title: "Conversion Rate", value: "3.2%", change: "+0.4%", icon: <FaChartLine className="text-2xl" />, color: "bg-[#14919B]" }
  ];

  return (
    <div className="p-6">
      {/* Animated Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-[#213A57] to-[#0AD1C8] p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 animate-pulse">Welcome to FoodChain!</h1>
          <p className="text-xl opacity-90">"Connecting food lovers with quality providers"</p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20">
          <FaUtensilSpoon className="text-[200px]" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')] opacity-5"></div>
      </div>

      {/* Analytics Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#213A57] mb-6 flex items-center">
          <FaChartLine className="mr-2" /> Business Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.map((item, index) => (
            <div key={index} className={`${item.color} text-white rounded-xl p-6 shadow-md hover:scale-[1.02] transition-transform`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">{item.title}</p>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                  <p className="text-sm mt-2 opacity-90">{item.change} from last week</p>
                </div>
                <div className="p-3 rounded-full bg-white bg-opacity-20">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-[#45DFB1]">
        <h2 className="text-xl font-semibold text-[#14919B] mb-4 flex items-center">
          <FaHistory className="mr-2" /> Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { id: 1, action: "New order placed", details: "5kg Organic Apples", time: "2 hours ago", icon: <GiFruitBowl /> },
            { id: 2, action: "Payment received", details: "$124.50 from John D.", time: "5 hours ago", icon: <FaShoppingBag /> },
            { id: 3, action: "New seller joined", details: "Fresh Seafood Co.", time: "1 day ago", icon: <FaUsers /> }
          ].map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-[#f0fdf4] rounded-lg transition">
              <div className="p-3 rounded-full bg-[#0AD1C8] bg-opacity-20 text-[#0AD1C8] mt-1">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[#213A57]">{activity.action}</h3>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-[#0AD1C8] hover:text-[#086477] font-medium flex items-center">
          View all activity <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}