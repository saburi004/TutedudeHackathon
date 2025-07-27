"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaWhatsapp,
  FaShoppingBasket,
  FaHome,
  FaUtensils,
  FaUser,
  FaCog,
  FaStore,
  FaCashRegister,
} from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#213A57] text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUtensils className="mr-2" /> FoodConnect
          </h1>
          <p className="text-[#0AD1C8] text-sm">Your food marketplace</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/buyerdashboard" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaHome className="mr-3" /> Dashboard
                </div>
              </Link>
            </li>
            <li>
              <Link href="/buyerdashboard/buyitems" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard/buyitems"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaShoppingBasket className="mr-3" /> Buy Items
                </div>
              </Link>
            </li>
            <li>
              <Link href="/buyerdashboard/suggestions" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard/sellers"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaStore className="mr-3" /> Suggestions
                </div>
              </Link>
            </li>
            <li>
              <Link href="/buyerdashboard/setsales" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard/sellers"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaCashRegister className="mr-3" /> Enter Sales
                </div>
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/yourwhatsappgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#14919B]"
              >
                <FaWhatsapp className="mr-3" /> Join Community
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-[#086477]">
          <ul className="space-y-2">
            <li>
              <Link href="/buyerdashboard/profile" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard/profile"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaUser className="mr-3" /> Profile
                </div>
              </Link>
            </li>
            <li>
              <Link href="/buyerdashboard/settings" passHref>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    pathname === "/buyerdashboard/settings"
                      ? "bg-[#086477]"
                      : "hover:bg-[#14919B]"
                  }`}
                >
                  <FaCog className="mr-3" /> Settings
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
};

export default DashboardLayout;
