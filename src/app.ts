import express from "express";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use(errorHandler);

export default app;
