// /models/RawMaterialSeller.js
import mongoose from 'mongoose';

const RawMaterialSellerSchema = new mongoose.Schema({
  sellerId: { type: String, unique: true },
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
// /models/RawMaterialSeller.js
// import mongoose from 'mongoose';

// const RawMaterialSellerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     trim: true
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters']
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // Remove the sellerId index if it exists
// RawMaterialSellerSchema.index({ sellerId: 1 }, { unique: false });

// export default mongoose.models.RawMaterialSeller || 
//        mongoose.model("RawMaterialSeller", RawMaterialSellerSchema);