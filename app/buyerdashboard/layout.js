'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/buyerDashboard';

export default function BuyerDashboardLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}
