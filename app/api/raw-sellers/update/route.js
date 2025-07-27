// /api/seller/updateDetails
import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { sellerId, location, availableMaterials } = body;

    // Build update object dynamically based on which fields are provided
    const updateFields = {};
    if (location) updateFields.location = location;
    if (availableMaterials)
      updateFields.availableMaterials = availableMaterials;

    const updatedSeller = await RawMaterialSeller.findByIdAndUpdate(
      sellerId,
      updateFields,
      { new: true }
    );

    if (!updatedSeller) {
      return Response.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, seller: updatedSeller });
  } catch (error) {
    console.error("Update Seller Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
