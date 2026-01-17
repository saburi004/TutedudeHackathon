import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import redis from "@/lib/redis";

// POST - Create a new review
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { buyerId, sellerId, sellerName, rating, comment } = body;

    // Validate required fields
    if (!buyerId || !sellerId || !sellerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if buyer has already reviewed this seller
    const existingReview = await Review.findOne({ buyerId, sellerId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this seller' },
        { status: 400 }
      );
    }

    // Perform sentiment analysis using Hugging Face API
    let sentiment = 'neutral';
    let sentimentScore = 0.5;

    try {
      const sentimentResponse = await fetch('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: comment
        })
      });

      if (sentimentResponse.ok) {
        const sentimentData = await sentimentResponse.json();
        if (sentimentData && sentimentData.length > 0) {
          const result = sentimentData[0];
          const maxScore = Math.max(...result.map(item => item.score));
          const topResult = result.find(item => item.score === maxScore);
          
          if (topResult) {
            sentimentScore = topResult.score;
            // Map Hugging Face labels to our sentiment values
            switch (topResult.label) {
              case 'LABEL_0': // Negative
                sentiment = 'negative';
                break;
              case 'LABEL_1': // Neutral
                sentiment = 'neutral';
                break;
              case 'LABEL_2': // Positive
                sentiment = 'positive';
                break;
              default:
                sentiment = 'neutral';
            }
          }
        }
      }
    } catch (sentimentError) {
      console.error('Sentiment analysis error:', sentimentError);
      // Continue with default values if sentiment analysis fails
    }

    // Create the review
    const review = new Review({
      buyerId,
      sellerId,
      sellerName,
      rating,
      comment,
      sentiment,
      sentimentScore
    });

    await review.save();
    // ❌ remove old cache
    await redis.del(`reviews:${sellerId}`);


    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review: {
        id: review._id,
        buyerId: review.buyerId,
        sellerId: review.sellerId,
        sellerName: review.sellerName,
        rating: review.rating,
        comment: review.comment,
        sentiment: review.sentiment,
        sentimentScore: review.sentimentScore,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// // GET - Get reviews for a specific seller
// export async function GET(request) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const sellerId = searchParams.get('sellerId');
//     const buyerId = searchParams.get('buyerId');

//     let query = {};
    
//     if (sellerId) {
//       query.sellerId = sellerId;
//     }
    
//     if (buyerId) {
//       query.buyerId = buyerId;
//     }

//     const reviews = await Review.find(query)
//       .sort({ createdAt: -1 })
//       .limit(50);

//     // Calculate average rating and sentiment summary for seller
//     let averageRating = 0;
//     let sentimentSummary = { positive: 0, negative: 0, neutral: 0 };
    
//     if (reviews.length > 0) {
//       averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
//       reviews.forEach(review => {
//         sentimentSummary[review.sentiment]++;
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       reviews: reviews.map(review => ({
//         id: review._id,
//         buyerId: review.buyerId,
//         sellerId: review.sellerId,
//         sellerName: review.sellerName,
//         rating: review.rating,
//         comment: review.comment,
//         sentiment: review.sentiment,
//         sentimentScore: review.sentimentScore,
//         createdAt: review.createdAt
//       })),
//       summary: {
//         totalReviews: reviews.length,
//         averageRating: Math.round(averageRating * 10) / 10,
//         sentimentSummary
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to fetch reviews' },
//       { status: 500 }
//     );
//   }
// }
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");

    // 🔑 Cache key (VERY IMPORTANT)
    const cacheKey = `reviews:${sellerId || "all"}`;

    // 1️⃣ Try Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("🚀 REDIS HIT:", cacheKey);
      return NextResponse.json(JSON.parse(cached));
    }

    console.log("🐌 REDIS MISS:", cacheKey);

    // 2️⃣ Build query
    let query = {};
    if (sellerId) query.sellerId = sellerId;
    if (buyerId) query.buyerId = buyerId;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // 3️⃣ Prepare response
    let averageRating = 0;
    let sentimentSummary = { positive: 0, negative: 0, neutral: 0 };

    if (reviews.length > 0) {
      averageRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      reviews.forEach((r) => {
        sentimentSummary[r.sentiment]++;
      });
    }

    const response = {
      success: true,
      reviews: reviews.map((r) => ({
        id: r._id,
        buyerId: r.buyerId,
        sellerId: r.sellerId,
        sellerName: r.sellerName,
        rating: r.rating,
        comment: r.comment,
        sentiment: r.sentiment,
        sentimentScore: r.sentimentScore,
        createdAt: r.createdAt,
      })),
      summary: {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        sentimentSummary,
      },
    };

    // 4️⃣ Save to Redis (5 min TTL)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
