import mongoose from "mongoose";

const StreetSellerSchema = new mongoose.Schema({
  buyerId: { type: String, unique: true }, // _id as string
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String, // hashed
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  foodItems: [String], // e.g., ["pav bhaji", "vada pav"]
  dailyInput: {
    totalPrepared: Number,
    totalSold: Number,
    date: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.StreetSeller ||
  mongoose.model("StreetSeller", StreetSellerSchema);
