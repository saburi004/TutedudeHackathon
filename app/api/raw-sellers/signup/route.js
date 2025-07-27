import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password, name, phone } = body; // ⛔️ removed `location` from destructuring

    // ✅ Check for existing email
    const existing = await RawMaterialSeller.findOne({
      "contact.email": email,
    });

    if (existing) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new seller without location (will add later)
    const newSeller = await RawMaterialSeller.create({
      name,
      contact: {
        email,
        phone,
      },
      password: hashedPassword,
    });

    // ✅ Return success with the new seller ID
    return Response.json({ success: true, sellerId: newSeller._id });
  } catch (error) {
    console.error("RawSeller Signup Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
