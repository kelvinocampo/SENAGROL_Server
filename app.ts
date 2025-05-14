import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"

import UserRoutes from "./Routes/user";
import SellerRoutes from "./Routes/seller";
import ProductRoutes from "./Routes/product";
import TransporterRoutes from "./Routes/transporter";
import IARoutes from "./Routes/IA";
import ChatRoutes from "./Routes/chat";
import AdminRoutes from "./Routes/admin";
import BuyerRoutes from "./Routes/buyer";
import BuyRoutes from "./Routes/buy";

dotenv.config();
const PORT = process.env.PORT || 10101;

const app = express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors({
        origin: 'https://senagrol.vercel.app', // Specify the allowed origin
        methods: 'GET,POST,PUT,DELETE', // Allow specific methods if necessary
        allowedHeaders: 'Content-Type,Authorization', // Adjust headers as needed
    }));

app.use("/usuario", UserRoutes);
app.use("/vendedor", SellerRoutes);
app.use("/transportador", TransporterRoutes);
app.use("/admin", AdminRoutes);
app.use("/comprador", BuyerRoutes);
app.use("/producto", ProductRoutes);
app.use("/compra", BuyRoutes);
app.use("/chat", ChatRoutes);
app.use("/IA", IARoutes);

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto:", PORT);
}).on("error", (error: { message: string | undefined }) => {
    throw new Error(error.message);
});
