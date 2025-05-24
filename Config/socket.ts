// Config/socket.ts
import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server): Server => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`Nueva conexión: ${socket.id}`);

        // Solo manejar conexión básica aquí
        socket.on("disconnect", () => {
            console.log(`Desconectado: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) throw new Error("Socket.IO no inicializado");
    return io;
};