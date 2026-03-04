import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3333, () => {
  console.log("🚀 Server running on port 3333");
});