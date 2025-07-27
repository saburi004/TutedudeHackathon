import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from '@/models/RawMaterialSeller';

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = context.params; // Access id from context.params

    const seller = await RawMaterialSeller.findById(id) // Using _id instead of sellerId
      .select('-__v')
      .lean();

    if (!seller) {
      return Response.json(
        { success: false, message: 'Seller not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, seller });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = context.params;
    const updateData = await request.json();

    // Update seller information
    const updatedSeller = await RawMaterialSeller.findByIdAndUpdate(
      id, // Using _id
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!updatedSeller) {
      return Response.json(
        { success: false, message: 'Seller not found' },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true, 
      message: 'Seller updated successfully',
      seller: updatedSeller 
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}