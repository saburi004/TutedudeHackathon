import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";
import bcrypt from "bcryptjs";
import generateToken from "@/lib/generateToken";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    const user = await RawMaterialSeller.findOne({ email });
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user._id);

    return Response.json({
      success: true,
      token,
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("RawSeller Login Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
