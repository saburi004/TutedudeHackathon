// app/api/street-sellers/update/[userId]/route.js
import connectDB from "@/lib/dbConnect";
import StreetSeller from "@/models/StreetSeller";
import mongoose from 'mongoose';

// Change from: export async function POST(request)
export async function PUT(request) {
  try {
    await connectDB();
    
    // Get userId from URL
    const userId = request.url.split('/').pop();
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: "Invalid seller ID" }, { status: 400 });
    }

    const body = await request.json();

    const updatedSeller = await StreetSeller.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true }
    );

    if (!updatedSeller) {
      return Response.json({ error: "Seller not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      seller: updatedSeller
    });
  } catch (error) {
    console.error("Update Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Get userId from URL
    const userId = request.url.split('/').pop();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: "Invalid seller ID" }, { status: 400 });
    }

    const body = await request.json();
    
    const updatedSeller = await StreetSeller.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true }
    );

    if (!updatedSeller) {
      return Response.json({ error: "Seller not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      seller: updatedSeller
    });
  } catch (error) {
    console.error("Update Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    // Get userId from URL
    const userId = request.url.split('/').pop();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: "Invalid seller ID" }, { status: 400 });
    }

    const seller = await StreetSeller.findById(userId).select('-password');
    
    if (!seller) {
      return Response.json({ error: "Seller not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      seller
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}