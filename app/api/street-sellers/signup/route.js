import connectDB from "@/lib/dbConnect";
import StreetSeller from "@/models/StreetSeller";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, name, phone } = body;

    // ✅ Check for existing email
    const existing = await StreetSeller.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create buyer without buyerId initially
    const createdBuyer = await StreetSeller.create({
      email,
      phone,
      name,
      password: hashedPassword,
    });

    // ✅ Update the document to set buyerId = _id
    createdBuyer.buyerId = createdBuyer._id.toString();
    await createdBuyer.save();

    return NextResponse.json({
      success: true,
      buyer: {
        id: createdBuyer._id,
        buyerId: createdBuyer.buyerId,
        name: createdBuyer.name,
        email: createdBuyer.email,
        phone: createdBuyer.phone,
      },
    });
  } catch (error) {
    console.error("StreetBuyer Signup Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
