'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/buyerDashboardLayout';

export default function BuyerDashboardLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}
