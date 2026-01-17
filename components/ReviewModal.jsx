'use client';
import { useState } from 'react';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, seller, buyerId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId,
          sellerId: seller.Seller_ID || seller.sellerId,
          sellerName: seller.Name || seller.sellerName,
          rating,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        onReviewSubmitted(data.review);
        onClose();
        setRating(0);
        setComment('');
        setError('');
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setRating(0);
      setComment('');
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#213A57]">
              Write a Review
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Seller Info */}
          <div className="mb-6 p-4 bg-[#f0fffe] rounded-lg border border-[#45DFB1]">
            <h3 className="font-medium text-[#213A57] mb-1">
              {seller.Name || seller.sellerName}
            </h3>
            <p className="text-sm text-gray-600">
              {seller.Locality || seller.location || 'Location not specified'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-[#213A57] mb-2">
                Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    className="focus:outline-none disabled:opacity-50"
                  >
                    <FaStar
                      size={24}
                      className={
                        star <= rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-[#213A57] mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0AD1C8] focus:border-[#0AD1C8] outline-none resize-none disabled:opacity-50"
                rows={4}
                placeholder="Share your experience with this seller..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !comment.trim()}
                className="flex-1 px-4 py-2 bg-[#0AD1C8] text-white rounded-lg hover:bg-[#086477] disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
