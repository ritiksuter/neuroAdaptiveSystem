import rateLimit from "express-rate-limit";

// General API limiter (default for all routes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
  headers: true, // include rate limit info in response headers
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 login/register attempts
  message: {
    status: 429,
    message: "Too many login attempts. Please wait before trying again.",
  },
  headers: true,
});
