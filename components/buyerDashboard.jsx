"use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   FaWhatsapp,
//   FaShoppingBasket,
//   FaHome,
//   FaUtensils,
//   FaUser,
//   FaCog,
//   FaStore,
//   FaCashRegister,
// } from "react-icons/fa";

// 'use client';
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  FaWhatsapp,
  FaShoppingBasket,
  FaCashRegister,
  FaHome,
  FaUtensils,
  FaUser,
  FaCog,
  FaStore,
  FaBars,
  FaChevronRight,
} from "react-icons/fa";

// Component that uses searchParams (must be client-side)
function DashboardLayout() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const createHref = (path) => `${path}${userId ? `?userId=${userId}` : ""}`;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#213A57] text-white p-4 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center cinzel-bold">
          <FaUtensils className="mr-2" /> Food Chain
        </h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Mobile Breadcrumb Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#213A57] shadow-lg rounded-b-lg p-4 absolute z-10 w-full">
          <div className="space-y-3">
            <Link href={createHref("/buyerdashboard")} passHref>
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  pathname === "/buyerdashboard"
                    ? "bg-[#086477]"
                    : "hover:bg-[#14919B]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="mr-3" /> Dashboard
                {pathname === "/buyerdashboard" && (
                  <FaChevronRight className="ml-auto" />
                )}
              </div>
            </Link>
            <Link href={createHref("/buyerdashboard/buyitems")} passHref>
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  pathname === "/buyerdashboard/buyitems"
                    ? "bg-[#086477]"
                    : "hover:bg-[#14919B]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingBasket className="mr-3" /> Buy Items
                {pathname === "/buyerdashboard/buyitems" && (
                  <FaChevronRight className="ml-auto" />
                )}
              </div>
            </Link>
            <Link href={createHref("/buyerdashboard/sellers")} passHref>
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  pathname === "/buyerdashboard/sellers"
                    ? "bg-[#086477]"
                    : "hover:bg-[#14919B]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaStore className="mr-3" /> Suggestions
                {pathname === "/buyerdashboard/sellers" && (
                  <FaChevronRight className="ml-auto" />
                )}
              </div>
            </Link>
            <a
              href="https://chat.whatsapp.com/CgQOF3pSRttKlZwXlytKSh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#14919B]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaWhatsapp className="mr-3" /> Join Community
            </a>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-64 bg-[#213A57] text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center cinzel-bold">
            <FaUtensils className="mr-2" /> Food Chain
          </h1>
          <p className="text-[#0AD1C8] text-sm lobster-two-bold-italic">
            Your food marketplace
          </p>
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
    </>
  );
}

export default DashboardLayout;
