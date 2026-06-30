import jwt from "jsonwebtoken";
import User from "../models/User.js";


const JWT_SECRET = "4v0CH0LfA9gHiR6Hv9c1WtVVwuVAsFaZ815OYOd3csm";

const generateToken = (id) => {
  return jwt.sign({ id: id.toString() }, JWT_SECRET, { expiresIn: "7d" });
};




const userResponse = (user, token) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  savedDeals: user.savedDeals || [],
  priceAlerts: user.priceAlerts || [],
  createdAt: user.createdAt,
  token,
});

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    console.log(" User registered:", user.email, "| Token:", token.slice(0, 20) + "...");

    res.status(201).json(userResponse(user, token));
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error(" Register error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    console.log("User logged in:", user.email, "| Token:", token.slice(0, 20) + "...");

    res.json(userResponse(user, token));
  } catch (error) {
    console.error(" Login error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    savedDeals: req.user.savedDeals || [],
    priceAlerts: req.user.priceAlerts || [],
    createdAt: req.user.createdAt,
  });
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (req.body.username) user.username = req.body.username;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    const token = generateToken(updated._id);

    res.json(userResponse(updated, token));
  } catch (error) {
    console.error(" Update error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export { JWT_SECRET };
