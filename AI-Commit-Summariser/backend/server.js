import express from "express";
import { main } from "./index.js";

const app = express();

app.use(express.json());

app.post("/summarisecommit", async (req, res) => {
  const { githubURL } = req.body;
  console.log("recieved githubURL from client: ", githubURL);

  const finalDataArray = await main(githubURL);

  res.json({
    msg: "summary generated successfully",
    finalDataArray
  });
});

app.listen("8080", () => {
  console.log("server is listening on port 8080");
});
