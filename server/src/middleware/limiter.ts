import rateLimit from "express-rate-limit";

const tooManyRequests = {
  message: "Demasiadas solicitudes, inténtalo más tarde",
};

export const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  legacyHeaders: true,
  message: tooManyRequests,
});

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  legacyHeaders: true,
  message: tooManyRequests,
});
