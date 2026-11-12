import { Router } from "express";
import { main } from "../index.js";
import SummaryHistory from "../models/SummaryHistory.js";
import requireAuth from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function getGithubUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim());
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "github.com" ||
      pathParts.length !== 2
    ) {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

router.post("/generate", async (req, res) => {
  const githubURL = getGithubUrl(req.body?.githubURL);

  if (!githubURL) {
    return res
      .status(400)
      .json({ msg: "githubURL must be a valid HTTPS GitHub repository URL" });
  }

  try {
    const finalSummaryArray = await main(githubURL);
    await SummaryHistory.create({
      user: req.user.userId,
      username: req.user.username,
      githubURL,
      finalSummaryArray,
    });

    return res.json({
      msg: "summary generated successfully",
      githubURL,
      finalSummaryArray,
    });
  } catch (error) {
    console.error("Summary generation failed:", error);
    return res.status(500).json({ msg: "Unable to generate summary" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await SummaryHistory.find({ user: req.user.userId })
      .select("githubURL finalSummaryArray createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ history });
  } catch (error) {
    console.error("Summary history fetch failed:", error);
    return res.status(500).json({ msg: "Unable to fetch summary history" });
  }
});

export default router;
