import connectDB from '@/lib/dbConnect';
import StreetSeller from '@/models/StreetSeller';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, name, phone } = body;

    const existing = await StreetSeller.findOne({ email });
    if (existing) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = await StreetSeller.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    return Response.json({ success: true, sellerId: newSeller._id });
  } catch (error) {
    console.error('Signup Error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
