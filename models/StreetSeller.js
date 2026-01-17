import mongoose from "mongoose";

const StreetSellerSchema = new mongoose.Schema({
  buyerId: { type: String, unique: true }, 
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String, 
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  foodItems: [String], 
  dailyInput: {
    totalPrepared: Number,
    totalSold: Number,
    date: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.StreetSeller ||
  mongoose.model("StreetSeller", StreetSellerSchema);
