import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, name, phone } = body;

    const existing = await RawMaterialSeller.findOne({ email });
    if (existing) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = await RawMaterialSeller.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    return Response.json({ success: true, sellerId: newSeller._id });
  } catch (error) {
    console.error("RawSeller Signup Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
