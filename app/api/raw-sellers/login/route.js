import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";
import bcrypt from "bcryptjs";
import generateToken from "@/lib/generateToken"; // adjust this import as per your setup

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // ✅ Corrected contact.email path
    const user = await RawMaterialSeller.findOne({ "contact.email": email });

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

    const token = generateToken(user._id); // or use your JWT logic

    return Response.json({
      success: true,
      token,
      seller: {
        id: user._id,
        name: user.name,
        email: user.contact.email, // ✅ fixed path
        phone: user.contact.phone, // ✅ fixed path
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
