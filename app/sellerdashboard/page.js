// app/sellerdashboard/page.js
import { Suspense } from 'react';
import SellerDashboard from "@/components/sellerdashboardDefault"

export default function SellerDashboardPage() {
  return (
    <Suspense>
      <SellerDashboard />
    </Suspense>
  );
}