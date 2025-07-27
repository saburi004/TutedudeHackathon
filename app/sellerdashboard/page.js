'use client';
import { Suspense } from 'react';
import SellerDashboard from "@/components/sellerdashboardDefault";

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SellerDashboard />
    </Suspense>
  );
}
