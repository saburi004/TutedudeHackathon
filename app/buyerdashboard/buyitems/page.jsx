import { Suspense } from "react";
import BuyItems from "@/components/buyitem";

export default function BuyItemsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyItems />
    </Suspense>
  );
}
