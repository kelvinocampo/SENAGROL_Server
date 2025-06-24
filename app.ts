import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

// Configuración de rutas
import UserRoutes from "./Routes/user";
import SellerRoutes from "./Routes/seller";
import ProductRoutes from "./Routes/product";
import TransporterRoutes from "./Routes/transporter";
import IARoutes from "./Routes/IA";
import ChatRoutes from "./Routes/chat";
import AdminRoutes from "./Routes/admin";
import BuyerRoutes from "./Routes/buyer";
import BuyRoutes from "./Routes/buy";

// Configuración de Socket.io
import { initSocket } from "./Config/socket";

dotenv.config();
const PORT = process.env.PORT || 10101;
const FRONTEND_URL = process.env.FRONTEND_URL || "";

// Inicialización de Express
export const app = express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors({
        origin: FRONTEND_URL,
        methods: 'GET,POST,PUT,PATCH,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true
    }));

// Crear servidor HTTP
const server = http.createServer(app);

export const io = initSocket(server);

// Configuración de rutas
app.use("/usuario", UserRoutes);
app.use("/vendedor", SellerRoutes);
app.use("/transportador", TransporterRoutes);
app.use("/admin", AdminRoutes);
app.use("/comprador", BuyerRoutes);
app.use("/producto", ProductRoutes);
app.use("/compra", BuyRoutes);
app.use("/chat", ChatRoutes);
app.use("/IA", IARoutes);

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
    console.log(`URL Frontend permitida: ${FRONTEND_URL}`);
}).on("error", (error: { message: string }) => {
    console.error("Error en el servidor:", error.message);
    process.exit(1);
});