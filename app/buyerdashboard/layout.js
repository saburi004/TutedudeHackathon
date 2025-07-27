// 'use client';
// import DashboardLayout from '@/components/buyerDashboard';

// export default function DashboardRootLayout({ children }) {
//   return <DashboardLayout>{children}</DashboardLayout>;
// }
'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/buyerDashboard';

export default function RootLayout({ children }) {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </DashboardLayout>
  );
}