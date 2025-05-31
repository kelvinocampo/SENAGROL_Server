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

        // Manejar unirse a una room de chat
        socket.on("join_chat", ({ chatId }) => {
            socket.join(`chat_${chatId}`);
            console.log(`Usuario ${socket.id} se unió al chat ${chatId}`);
        });

        // Manejar salir de una room de chat
        socket.on("leave_chat", ({ chatId }) => {
            socket.leave(`chat_${chatId}`);
            console.log(`Usuario ${socket.id} salió del chat ${chatId}`);
        });

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