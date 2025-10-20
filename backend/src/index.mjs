import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import configurePassport from "../strategy/passport.mjs";
import dotenv from "dotenv";
import cors from "cors";
import routes from "../routes/index.mjs";
import router from "../routes/index.mjs";
import { startReminderJob } from "../jobs/reminderJobs.mjs";


dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());
configurePassport(passport);
app.use(router);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to Mongo atlas"))
  .catch((err) => console.log(`Error:${err}`));
app.use(express.json());


// startReminderJob();
const PORT = process.env.PORT || 5014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
