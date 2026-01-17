# 🍽️ FoodChain
### AI-Powered Raw Material Sourcing Platform for Street Food Vendors
## A perfect combination of AIML and WebDev

SmartStreetSupply is a full-stack web application designed to help **street food vendors find trusted nearby raw material sellers** while maintaining **high food quality and minimizing daily food wastage**.
The platform integrates **AI and Machine Learning** to provide **personalized quantity estimation**, **nearest seller discovery**, and **review sentiment analysis**, enabling smarter and more sustainable food operations.

---

## 🚀 Features

### 👨‍🍳 Street Food Vendors
- Find **nearby raw material sellers**
- Get **AI-based raw material quantity estimation**
- Reduce **daily food wastage**
- View **seller ratings based on sentiment analysis**

### 🏪 Raw Material Sellers
- List available raw materials
- Reach nearby vendors easily
- Build trust through transparent reviews

---

## 🧠 AI & Machine Learning

- **KNN Algorithm** to find the nearest raw material sellers
- **Personalized AI Model** for quantity estimation using daily wastage data
- **Sentiment Analysis (NLP)** to classify seller reviews
- **Redis** caching for faster ML model responses

---

## 🏗️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Caching
- Redis

### Machine Learning
- K-Nearest Neighbors (KNN)
- Sentiment Analysis (NLP)

---

## ⚙️ How It Works

1. Vendor enters daily sales and food wastage data
2. AI estimates the **exact raw material quantity required**
3. KNN model identifies **nearest trusted sellers**
4. Sentiment analysis validates seller reviews
5. Redis caches results for faster future access
6. Vendor places order with confidence

---
## 🚀 Getting Started

Follow these steps to run the project locally.

---

### 📦 Prerequisites
Make sure you have the following installed:
- **Node.js** (v18 or above recommended)
- **npm**
- **MongoDB**
- **Redis**
- **Docker compose**
  
---

### 🔽 Clone the Repository
```bash
git clone https://github.com/saburi004/TutedudeHackathon.git
cd TutedudeHackathon
npm install
```
Create a .env file in the root directory and add the following:
JWT_SECRET=your_secret_key
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_api_key

```bash
docker compose up -d 
npm run dev



