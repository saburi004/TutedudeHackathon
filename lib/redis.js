// import Redis from "ioredis";

// const redis = new Redis({
//   host: "localhost",
//   port: 6379,
// });

// export default redis;
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
