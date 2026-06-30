import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../controller/authController.js";

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header:
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      return next(); 
    } catch (error) {
      console.error(" Token verification failed:", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

export default protect;
