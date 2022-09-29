import express from "express";
import { adminRouter } from "./routes/adminRoutes";
import { publicRouter } from "./routes/publicRoutes";
import { connectDB } from "./DBconnection/mongoUtil";
import cookieParser from "cookie-parser";
import cors from "cors";
import { roleRouter } from "./routes/roleRoutes";
import http from "http";
import socketServer from "./socketio/socketServer";

const app = express();
const server = http.createServer(app); //socket server

const callsPlaceholder = ["test1", "test1", "test1", "test1", "test1", "test1", "test1"];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: (process.env.TRUST_LINK as string) || true,
  })
);

app.use("/", adminRouter);
app.use("/", publicRouter);
app.use("/role", roleRouter);

connectDB();

//turn on socket
socketServer(server);
server.listen(80, () => {
  console.log("SOCKET IS ALIVE! " + 80);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("IS ALIVE!!!! on PORT " + PORT);
});
