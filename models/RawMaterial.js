// /models/RawMaterial.js
import mongoose from 'mongoose';

const RawMaterialSchema = new mongoose.Schema({
  name: String, // e.g., "potatoes"
  unit: String, // kg, litre, etc.
  image: String, // optional
  description: String
});

export default mongoose.models.RawMaterial || mongoose.model("RawMaterial", RawMaterialSchema);
