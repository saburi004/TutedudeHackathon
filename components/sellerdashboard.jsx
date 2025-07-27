'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaStore, FaCertificate, FaClipboardCheck, FaUser, FaCog, FaBoxOpen, FaCommentAlt, FaUtensils, FaBars, FaChevronRight } from 'react-icons/fa';

const SellerDashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#f5f5f5]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#213A57] text-white p-4 flex items-center justify-between">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center">
          <FaUtensils className="mr-2 cinzel-bold" /> FoodChain
        </h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      {/* Mobile Breadcrumb Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#213A57] shadow-lg rounded-b-lg p-4 absolute z-10 w-full">
          <div className="space-y-3">
            <Link href="/seller-dashboard" passHref>
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaChartLine className="mr-3" /> Dashboard
                {pathname === '/seller-dashboard' && <FaChevronRight className="ml-auto" />}
              </div>
            </Link>
            <Link href="/seller-dashboard/products" passHref>
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/products' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaBoxOpen className="mr-3" /> My Products
                {pathname === '/seller-dashboard/products' && <FaChevronRight className="ml-auto" />}
              </div>
            </Link>
            <Link href="/seller-dashboard/certificates" passHref>
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/certificates' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCertificate className="mr-3" /> Hygiene Certificates
                {pathname === '/seller-dashboard/certificates' && <FaChevronRight className="ml-auto" />}
              </div>
            </Link>
            <Link href="/seller-dashboard/reviews" passHref>
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/reviews' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCommentAlt className="mr-3" /> Customer Reviews
                {pathname === '/seller-dashboard/reviews' && <FaChevronRight className="ml-auto" />}
              </div>
            </Link>
            <Link href="/sellerdashboard/quality-checks" passHref>
              <div 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/sellerdashboard/quality-checks' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaClipboardCheck className="mr-3" /> Quality Checks
                {pathname === '/sellerdashboard/quality-checks' && <FaChevronRight className="ml-auto" />}
              </div>
            </Link>
            <div className="pt-2 border-t border-[#086477]">
              <Link href="/seller-dashboard/profile" passHref>
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/profile' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaUser className="mr-3" /> Profile
                  {pathname === '/seller-dashboard/profile' && <FaChevronRight className="ml-auto" />}
                </div>
              </Link>
              <Link href="/seller-dashboard/settings" passHref>
                <div 
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/settings' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCog className="mr-3" /> Settings
                  {pathname === '/seller-dashboard/settings' && <FaChevronRight className="ml-auto" />}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-64 bg-[#213A57] text-white p-4 flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUtensils className="mr-2" /> FoodChain Seller
          </h1>
          <p className="text-[#0AD1C8] text-sm">Your food business hub</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
             
            <p>Note:  The data used for the project is fetched through registration and dummy data along with registered ones are used for model training</p>
             
            </li>
           
           
         
            {/* <li>
              <Link href="/sellerdashboard/quality-checks" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/sellerdashboard/quality-checks' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaClipboardCheck className="mr-3" /> Quality Checks
                </div>
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* <div className="mt-auto pt-4 border-t border-[#086477]">
          <ul className="space-y-2">
            <li>
              <Link href="/seller-dashboard/profile" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/profile' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaUser className="mr-3" /> Profile
                </div>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard/settings" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/settings' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaCog className="mr-3" /> Settings
                </div>
              </Link>
            </li>
          </ul>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default SellerDashboardLayout;