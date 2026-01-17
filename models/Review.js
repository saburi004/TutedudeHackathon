import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true,
    ref: 'StreetSeller'
  },
  sellerId: {
    type: String,
    required: true,
    ref: 'StreetSeller'
  },
  sellerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  sentimentScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
