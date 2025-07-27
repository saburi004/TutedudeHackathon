import { Suspense } from 'react';
import BuyerDashboard from '@/components/buyerdashboardDefault';


export default function BuyerDashboardPage() {
  return (
    <Suspense>
      <BuyerDashboard />
    </Suspense>
  );
}