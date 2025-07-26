// app/api/predict/route.js (GET API using generateContentStream)
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SalesInput from "@/models/SalesInput";
import { verifyJWT } from "@/middleware/auth";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // Secure API key usage
});

// GET handler
export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyJWT(token);
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  try {
    // Fetch all sales data of this seller
    const sales = await SalesInput.find({ sellerId: decoded.userId });

    if (!sales.length) {
      return NextResponse.json({
        message: "No sales data found for prediction.",
      });
    }

    const prompt = generateGeminiPrompt(sales);

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const tools = [
      {
        googleSearch: {}, // Optional tool config
      },
    ];

    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

    const stream = await genAI.models.generateContentStream({
      model: "gemini-2.5-pro",
      config,
      contents,
    });

    // Convert stream to ReadableStream for Postman
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return NextResponse.json(
      { error: "Failed to generate prediction from Gemini" },
      { status: 500 }
    );
  }
}

// Prompt generator
function generateGeminiPrompt(sales) {
  let prompt = `You are a food waste management AI assistant.

Based on the following weekly food sales data, suggest a list of only the necessary raw materials that should be ordered to avoid food wastage.

✅ For each raw material, include:
- Name
- Estimated quantity to order
- One-line reason (based on usage trends)

❌ Avoid greetings or explanations.
✅ Output format should be a clear and concise list, like this:

Raw Material: [Name]  
Quantity to Order: [Amount + Unit]  
Reason: [Short reason for the quantity to be ordered]

---`;

  sales.forEach((sale) => {
    prompt += `\n\nDate: ${new Date(sale.date).toDateString()}`;
    sale.foodItems.forEach((item) => {
      prompt += `\nFood Item: ${item.itemName}, Prepared: ${item.quantityPrepared}, Sold: ${item.quantitySold}`;
    });
  });

  return prompt;
}
