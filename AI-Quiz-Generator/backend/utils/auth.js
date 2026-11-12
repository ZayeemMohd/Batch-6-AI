import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
};

export const createToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, getJwtSecret(), { expiresIn: "7d" });

export const authenticate = (req, res, next) => {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication token is required" });
  }

  try {
    const payload = jwt.verify(header.slice(7), getJwtSecret());
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      return res.status(401).json({ error: "Invalid authentication token" });
    }
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired authentication token" });
  }
};
