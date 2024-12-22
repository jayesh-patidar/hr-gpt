import "dotenv/config";
import express, { Express, Request, Response } from "express";
import Mongo from "./mongo";
import { callAgent } from "./agent";

const app: Express = express();
app.use(express.json());

async function startServer() {
  try {
    const client = await Mongo.connect();

    app.post("/chat", async (req: Request, res: Response) => {
      const initialMessage = req.body.message;
      const threadId = Date.now().toString();

      try {
        const response = await callAgent(client, initialMessage, threadId);

        res.json({ threadId, response });
      } catch (error) {
        console.error("Error starting the conversation:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/chat/:threadId", async (req: Request, res: Response) => {
      const { threadId } = req.params;
      const { message } = req.body;

      try {
        const response = await callAgent(client, message, threadId);

        res.json({ response });
      } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
