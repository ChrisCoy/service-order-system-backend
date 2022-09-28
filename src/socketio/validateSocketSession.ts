import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { valideAndReturnUser } from "../JWTUtil/JWT";

export default function validateSocketSession(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
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
}
