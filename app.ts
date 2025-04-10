import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./config/configDB"; // Asegúrate de que esta ruta sea correcta

import UserRoutes from "./routes/user";
import SellerRoutes from "./routes/seller";
import ProductRoutes from "./routes/product";
import TransporterRoutes from "./routes/transporter";
import IARoutes from "./routes/IA";
import ChatRoutes from "./routes/chat";
import AdminRoutes from "./routes/admin";
import BuyerRoutes from "./routes/buyer";
import BuyRoutes from "./routes/buy";

dotenv.config();
const app = express().use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 10101;

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
