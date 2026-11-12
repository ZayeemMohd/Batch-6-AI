import { Router } from "express";
import { User } from "../models/User.js";
import { createToken } from "../utils/auth.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { isValidEmail } from "../utils/validation.js";

const router = Router();

const userResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (
      typeof username !== "string" ||
      username.trim().length < 2 ||
      username.trim().length > 30 ||
      typeof email !== "string" ||
      !isValidEmail(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        error: "Username must be 2-30 characters, email must be valid, and password must be 8-128 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) return res.status(409).json({ error: "Email is already registered" });

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
    });

    return res.status(201).json({ token: createToken(user), user: userResponse(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: "Email is already registered" });
    return next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || !isValidEmail(email) || typeof password !== "string") {
      return res.status(400).json({ error: "A valid email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({ token: createToken(user), user: userResponse(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
