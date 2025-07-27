// // 'use client';
// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { FaWhatsapp, FaShoppingBasket, FaHome, FaUtensils, FaUser, FaCog, FaStore } from 'react-icons/fa';

// // const DashboardLayout = ({ children }) => {
// //   const pathname = usePathname();

// //   return (
// //     <div className="flex h-screen bg-[#f5f5f5]">
// //       {/* Left Sidebar */}
// //       <div className="w-64 bg-[#213A57] text-white p-4 flex flex-col">
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold flex items-center cinzel-bold ">
// //             <FaUtensils className="mr-2" /> Food Chain
// //           </h1>
// //           <p className="text-[#0AD1C8] text-sm lobster-two-bold-italic">Your food marketplace</p>
// //         </div>

// //         <nav className="flex-1">
// //           <ul className="space-y-2">
// //             <li>
// //               <Link href="/buyerdashboard" passHref>
// //                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
// //                   <FaHome className="mr-3" /> Dashboard
// //                 </div>
// //               </Link>
// //             </li>
// //             <li>
// //               <Link href="/buyerdashboard/buyitems" passHref>
// //                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/buyitems' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
// //                   <FaShoppingBasket className="mr-3" /> Buy Items
// //                 </div>
// //               </Link>
// //             </li>
// //             <li>
// //               <Link href="/dashboard/sellers" passHref>
// //                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/sellers' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
// //                   <FaStore className="mr-3" /> Sellers
// //                 </div>
// //               </Link>
// //             </li>
// //             <li>
// //               <a 
// //                 href="https://wa.me/yourwhatsappgroup" 
// //                 target="_blank" 
// //                 rel="noopener noreferrer"
// //                 className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#14919B]"
// //               >
// //                 <FaWhatsapp className="mr-3" /> Join Community
// //               </a>
// //             </li>
// //           </ul>
// //         </nav>

// //         <div className="mt-auto pt-4 border-t border-[#086477]">
// //           <ul className="space-y-2">
// //             <li>
// //               <Link href="/buyerdashboard/profile" passHref>
// //                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/profile' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
// //                   <FaUser className="mr-3" /> Profile
// //                 </div>
// //               </Link>
// //             </li>
// //             <li>
// //               <Link href="/buyerdashboard/settings" passHref>
// //                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/settings' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
// //                   <FaCog className="mr-3" /> Settings
// //                 </div>
// //               </Link>
// //             </li>
// //           </ul>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-auto p-8">
// //         {children}
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;

// 'use client';
// import Link from 'next/link';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { FaWhatsapp, FaShoppingBasket, FaHome, FaUtensils, FaUser, FaCog, FaStore } from 'react-icons/fa';

// const DashboardLayout = ({ children }) => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const userId = searchParams.get('userId');

//   // Helper function to generate links with userId
//   const createHref = (path) => {
//     return `${path}${userId ? `?userId=${userId}` : ''}`;
//   };

//   return (
//     <div className="flex h-screen bg-[#f5f5f5]">
//       {/* Left Sidebar */}
//       <div className="w-64 bg-[#213A57] text-white p-4 flex flex-col">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold flex items-center cinzel-bold">
//             <FaUtensils className="mr-2" /> Food Chain
//           </h1>
//           <p className="text-[#0AD1C8] text-sm lobster-two-bold-italic">Your food marketplace</p>
//         </div>

//         <nav className="flex-1">
//           <ul className="space-y-2">
//             <li>
//               <Link href={createHref("/buyerdashboard")} passHref>
//                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
//                   <FaHome className="mr-3" /> Dashboard
//                 </div>
//               </Link>
//             </li>
//             <li>
//               <Link href={createHref("/buyerdashboard/buyitems")} passHref>
//                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/buyitems' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
//                   <FaShoppingBasket className="mr-3" /> Buy Items
//                 </div>
//               </Link>
//             </li>
//             <li>
//               <Link href={createHref("/buyerdashboard/sellers")} passHref>
//                 <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/sellers' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
//                   <FaStore className="mr-3" /> Sellers
//                 </div>
//               </Link>
//             </li>
//             <li>
//               <a 
//                 href="https://chat.whatsapp.com/CgQOF3pSRttKlZwXlytKSh" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#14919B]"
//               >
//                 <FaWhatsapp className="mr-3" /> Join Community
//               </a>
//             </li>
//           </ul>
//         </nav>

//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto p-8">
//         {children}
//       </div>
//     </div>
//   );
// };


// export default DashboardLayout;
'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaWhatsapp, FaShoppingBasket, FaHome, FaUtensils, FaUser, FaCog, FaStore } from 'react-icons/fa';

// Component that uses searchParams (must be client-side)
function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const createHref = (path) => `${path}${userId ? `?userId=${userId}` : ''}`;

  return (
    <div className="w-64 bg-[#213A57] text-white p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center cinzel-bold">
          <FaUtensils className="mr-2" /> Food Chain
        </h1>
        <p className="text-[#0AD1C8] text-sm lobster-two-bold-italic">Your food marketplace</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href={createHref("/buyerdashboard")} passHref>
              <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                <FaHome className="mr-3" /> Dashboard
              </div>
            </Link>
          </li>
          <li>
            <Link href={createHref("/buyerdashboard/buyitems")} passHref>
              <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/buyitems' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                <FaShoppingBasket className="mr-3" /> Buy Items
              </div>
            </Link>
          </li>
          <li>
            <Link href={createHref("/buyerdashboard/sellers")} passHref>
              <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/sellers' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                <FaStore className="mr-3" /> Sellers
              </div>
            </Link>
          </li>
          <li>
            <a 
              href="https://chat.whatsapp.com/CgQOF3pSRttKlZwXlytKSh" 
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
            <Link href={createHref("/buyerdashboard/profile")} passHref>
              <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/profile' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                <FaUser className="mr-3" /> Profile
              </div>
            </Link>
          </li>
          <li>
            <Link href={createHref("/buyerdashboard/settings")} passHref>
              <div className={`flex items-center p-3 rounded-lg cursor-pointer ${pathname === '/buyerdashboard/settings' ? 'bg-[#086477]' : 'hover:bg-[#14919B]'}`}>
                <FaCog className="mr-3" /> Settings
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      <Suspense fallback={
        <div className="w-64 bg-[#213A57] p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      }>
        <SidebarContent />
      </Suspense>

      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}