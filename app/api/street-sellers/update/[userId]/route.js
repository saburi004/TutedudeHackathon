import connectDB from "@/lib/dbConnect";
import StreetSeller from "@/models/StreetSeller";

export async function PUT(request) {
  try {
    await connectDB();
    
    // Extract userId from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];
    
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
    
    // Extract userId from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    const seller = await StreetSeller.findById(userId)
      .select('-password');

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