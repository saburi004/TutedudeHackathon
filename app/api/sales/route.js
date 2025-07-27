import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { verifyJWT } from "@/middleware/auth";
import SalesInput from "@/models/SalesInput";

// ✅ Connect to the database
connectDB();

export async function POST(req) {
  try {
    // ✅ 1. Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // ✅ 2. Verify token
    const decoded = verifyJWT(token); // should return { id, ... }

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    // ✅ 3. Parse request body
    const body = await req.json();

    // ✅ 4. Create new SalesInput with sellerId from token
    const newInput = new SalesInput({
      sellerId: decoded.id, // attaching seller ID from token
      foodItems: body.foodItems,
    });

    // ✅ 5. Save to DB
    await newInput.save();

    return NextResponse.json({ message: "Sales data saved", data: newInput });
  } catch (err) {
    console.error("Sales input error:", err);
    return NextResponse.json(
      { message: "Error saving sales input", error: err.message },
      { status: 500 }
    );
  }
}

