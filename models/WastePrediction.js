// /models/WastePrediction.js
import mongoose from 'mongoose';

const WastePredictionSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreetSeller' },
  date: { type: Date, default: Date.now },
  predictedWaste: [
    {
      material: String, // e.g., "tomato"
      predictedAmount: Number, // in kg or unit
    }
  ],
  suggestedPurchase: [
    {
      material: String,
      suggestedAmount: Number
    }
  ]
});

export default mongoose.models.WastePrediction || mongoose.model("WastePrediction", WastePredictionSchema);
