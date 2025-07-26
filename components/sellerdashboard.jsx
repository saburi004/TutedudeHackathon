'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaStore, FaCertificate, FaClipboardCheck, FaUser, FaCog, FaBoxOpen, FaCommentAlt, FaUtensils } from 'react-icons/fa';

const SellerDashboardLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#213A57] text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUtensils className="mr-2" /> FoodChain Seller
          </h1>
          <p className="text-[#0AD1C8] text-sm">Your food business hub</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link href="/seller-dashboard" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaChartLine className="mr-3" /> Dashboard
                </div>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard/products" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/products' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaBoxOpen className="mr-3" /> My Products
                </div>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard/certificates" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/certificates' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaCertificate className="mr-3" /> Hygiene Certificates
                </div>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard/reviews" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/reviews' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaCommentAlt className="mr-3" /> Customer Reviews
                </div>
              </Link>
            </li>
            <li>
              <Link href="/seller-dashboard/quality-checks" passHref>
                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/seller-dashboard/quality-checks' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                  <FaClipboardCheck className="mr-3" /> Quality Checks
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-[#086477]">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
};

export default SellerDashboardLayout;