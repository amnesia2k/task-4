import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger.js";
import { connectToDB } from "./db/mongo.js";
import morgan from "morgan";
import routes from "./routes/index.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

connectToDB();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api/v1", routes);

// error middleware
app.use((err, _req, res, _next) => {
  logger.error(err);
  res.status(500).json({
    error: err.message,
    success: false,
    message: "Internal Server Error",
  });
});

// not found middleware
app.use((_req, res, _next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
