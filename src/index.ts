import express from "express";
import { adminRouter } from "./routes/adminRoutes";
import { publicRouter } from "./routes/publicRoutes";
import { connectDB } from "./DBconnection/mongoUtil";
import cookieParser from "cookie-parser";
import cors from "cors";
import { roleRouter } from "./routes/roleRoutes";
import http from "http";
import socketServer from "./socketio/socketServer";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app); //socket server

const io = new Server(server, {
  cors: {
    origin: (process.env.TRUST_SOCKET_LINK as string) || true,
    allowedHeaders: ["token"],
  },
}).listen(server);

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
const PORT = process.env.PORT || 3001;

//turn on socket
socketServer(server, io);
server.listen(PORT, () => {
  console.log("SOCKET IS ALIVE! " + PORT);
});

// app.listen(PORT, () => {
//   console.log("IS ALIVE!!!! on PORT " + PORT);
// });
