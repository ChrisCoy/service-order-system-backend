import { Server } from "socket.io";
import http from "http";
import validateSocketSession from "./validateSocketSession";
import { valideAndReturnUser } from "../JWTUtil/JWT";
import { Call, ICall } from "../models/Call";

export default function socketServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: (process.env.TRUST_LINK as string) || true,
    },
  });

  io.use(validateSocketSession); //validate socket session

  io.on("connection", async (socket) => {
    const { token } = socket.handshake.headers;
    const validUser = valideAndReturnUser(token);
    const userRole = validUser.isAdmin ? "admin" : validUser.role;

    socket.join(userRole);

    socket.on("disconnecting", () => {
      socket.rooms.clear();
      socket.rooms.size === 0;
    });

    async function getCalls() {
      try {
        const calls = await Call.find(!validUser.isAdmin ? { sector: validUser.role } : {})
          .populate("sector")
          .populate("author")
          .sort({ _id: -1 });

        return calls.map((call: any): any => {
          return {
            _id: call._id,
            date: call.date || "",
            resume: call.resume || "",
            author: call.author?.name || "",
            sector: call.sector?.name || "",
          };
        });
      } catch (error) {
        console.error(error);
        return [];
      }
    }

    io.to(userRole).emit("get-all-calls", await getCalls());

    socket.on("send-new-order", async (order) => {
      try {
        const newOrder = await new Call({
          author: order.author,
          date: new Date().toDateString(),
          resume: order.resume,
          sector: order.sector,
        }).save();

        const call = await Call.find({ _id: newOrder._id })
          .populate("sector")
          .populate("author");

        const treatedCall: ICall = call.map((call: any): any => {
          return {
            _id: call._id,
            date: call.date,
            resume: call.resume,
            author: call.author.name,
            sector: call.sector.name,
          };
        })[0];

        io.to(call[0].sector?._id?.toString()).to("admin").emit("update-orders", treatedCall);
      } catch (err) {
        console.error(err);
      }
    });
  });
}
