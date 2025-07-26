// /models/Transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetSeller' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterialSeller' },
  items: [
    {
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial' },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
