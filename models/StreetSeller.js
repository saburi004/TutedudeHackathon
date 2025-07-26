// /models/StreetSeller.js
import mongoose from 'mongoose';

const StreetSellerSchema = new mongoose.Schema({
  Id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String, // hashed
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  foodItems: [String], // e.g., ["pav bhaji", "vada pav"]
  dailyInput: {
    totalPrepared: Number, // e.g., plates
    totalSold: Number,
    date: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.StreetSeller || mongoose.model("StreetSeller", StreetSellerSchema);
// /models/StreetSeller.js
