// components/buyitem.js

'use client'; // ← This is required at the top

import { useSearchParams } from 'next/navigation';

const BuyItems = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div>
      {/* <h1>Buy Items</h1> */}
      {/* <p>Selected Category: {category}</p> */}
    </div>
  );
};

export default BuyItems;
