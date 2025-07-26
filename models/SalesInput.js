const mongoose = require("mongoose");

const SalesItemSchema = new mongoose.Schema({
  itemName: String,
  quantityPrepared: Number,
  quantitySold: Number,
});

const SalesInputSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterialSeller",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  foodItems: [SalesItemSchema],
});

module.exports =
  mongoose.models.SalesInput || mongoose.model("SalesInput", SalesInputSchema);
