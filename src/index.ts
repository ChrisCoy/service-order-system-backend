import express from "express";
import { adminRouter } from "./routes/adminRoutes";
import { publicRouter } from "./routes/publicRoutes";
import { connectDB } from "./DBconnection/mongoUtil";
import cookieParser from "cookie-parser";
import cors from "cors";
import { roleRouter } from "./routes/roleRoutes";
import { Server } from "socket.io";
import http from "http";
import { valideAndReturnUser } from "./JWTUtil/JWT";
import { Call } from "./models/Call";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (process.env.TRUST_LINK as string) || true,
  },
});

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

io.use((socket, next) => {
  try {
    const { token } = socket.handshake.headers;

    if (!token) {
      return next(new Error("Mising token!"));
    }

    const validToken = valideAndReturnUser(token);

    if (!validToken) {
      return next(new Error("Invalid Token!"));
    }
    return next();
  } catch (err) {
    console.error({ err: "Invalid Token!" });
    return next(new Error("Invalid Token!"));
  }
});

io.on("connection", async (socket) => {
  console.log(`connected id: ${socket.id}`);
  const { token } = socket.handshake.headers;
  const validUser = valideAndReturnUser(token);

  async function getCalls() {
    try {
      const calls = await Call.find({ sector: validUser.role })
        .populate("sector")
        .populate("author")
        .sort({ date: -1 });

      return calls.map((call: any): any => {
        return {
          _id: call._id,
          date: call.date,
          resume: call.resume,
          author: call.author.name,
          sector: call.sector.name,
        };
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  socket.emit("get-all-calls", await getCalls());

  socket.on("send-new-order", async (order) => {
    console.log("teste");

    try {
      const newOrder = await new Call({
        author: order.author,
        date: new Date().toDateString(),
        resume: order.resume,
        sector: order.sector,
      }).save();

      io.emit("update-orders", newOrder);
    } catch (err) {
      console.error(err);
    }
  });
});

server.listen(3002, () => {
  console.log("SOCKET IS ALIVE! " + 3002);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("IS ALIVE!!!! on PORT " + PORT);
});
