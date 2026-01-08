import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JS from reading the cookie (Security) & Security: Prevents XSS
    secure: process.env.NODE_ENV === "production", // Required for SameSite: none & Must be true for 'none' to work
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allows cross-site for Vercel -> Render
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
