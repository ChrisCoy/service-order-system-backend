import express from "express";
import { adminRouter } from "./routes/adminRoutes";
import { publicRouter } from "./routes/publicRoutes";
import { connectDB } from "./DBconnection/mongoUtil";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.TRUST_LINK as string,
    credentials: true,
  })
);

app.use("/", adminRouter);
app.use("/", publicRouter);

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("IS ALIVE!!!! on PORT " + PORT));
