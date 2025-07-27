// /models/RawMaterialSeller.js
import mongoose from 'mongoose';

const RawMaterialSellerSchema = new mongoose.Schema({
sellerId: { type: String, unique: true, sparse: true },
  name: String,
  contact: {
    phone: String,
    email: String,
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  availableMaterials: [
    {
      materialId: mongoose.Schema.Types.ObjectId,
      price: Number,
      quantityAvailable: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.RawMaterialSeller || mongoose.model("RawMaterialSeller", RawMaterialSellerSchema);
