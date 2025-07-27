import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
// import SalesInput from "@/models/SalesInput";
import SalesInput from "@/models/SalesInput";

import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized - Missing token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const body = await req.json();
  const { foodItems } = body;

  if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
    return NextResponse.json(
      { error: "Food items are required" },
      { status: 400 }
    );
  }

  const hasInvalidItem = foodItems.some(
    (item) =>
      !item.itemName ||
      typeof item.quantityPrepared !== "number" ||
      typeof item.quantitySold !== "number"
  );

  if (hasInvalidItem) {
    return NextResponse.json({ error: "Invalid item format" }, { status: 400 });
  }

  try {
    const newSale = await SalesInput.create({
      sellerId: decoded.userId,
      foodItems,
    });

    return NextResponse.json(
      { message: "Sales data saved", data: newSale },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sales Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save sales" },
      { status: 500 }
    );
  }
}

