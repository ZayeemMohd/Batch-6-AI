import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !username.trim() ||
    !password
  ) {
    return res
      .status(400)
      .json({ msg: "email, username, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ msg: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Signup successful",
      token: createToken(user),
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ msg: "Email or username already exists" });
    }
    console.error("Signup failed:", error);
    return res.status(500).json({ msg: "Unable to create account" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ msg: "email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+password"
    );
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    return res.json({
      msg: "Signin successful",
      token: createToken(user),
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Signin failed:", error);
    return res.status(500).json({ msg: "Unable to sign in" });
  }
});

export default router;
