
import connectDB from "@/lib/dbConnect";
import RawMaterialSeller from "@/models/RawMaterialSeller";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }
    
    const seller = await RawMaterialSeller.findById(id).select('-name -password -contact.phone -contact.email');
    
    if (!seller) {
      return Response.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, seller });
  } catch (error) {
    console.error("Get Seller Error:", error);
    return Response.json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    
    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid seller ID" },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    const { location, availableMaterials } = body;

    // Validate materialId before converting to ObjectId
    const processedMaterials = availableMaterials?.map(material => {
      if (!mongoose.Types.ObjectId.isValid(material.materialId)) {
        throw new Error(`Invalid materialId: ${material.materialId}`);
      }
      return {
        ...material,
        materialId: new mongoose.Types.ObjectId(material.materialId)
      };
    });

    const updateFields = {};
    if (location) updateFields.location = location;
    if (processedMaterials) updateFields.availableMaterials = processedMaterials;

    const updatedSeller = await RawMaterialSeller.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-name -password -contact.phone -contact.email');

    if (!updatedSeller) {
      return Response.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, seller: updatedSeller });
  } catch (error) {
    console.error("Update Seller Error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return Response.json({ 
        success: false, 
        message: "Invalid data format" 
      }, { status: 400 });
    }
    
    if (error.name === 'ValidationError') {
      return Response.json({ 
        success: false, 
        message: "Validation error", 
        details: error.message 
      }, { status: 400 });
    }
    
    return Response.json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    }, { status: 500 });
  }
}