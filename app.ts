import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import userRoutes from './routes/user';
import TransporterRoutes from './routes/transporter';
import SellerRoutes from './routes/seller'; 



//import productRoutes from "./routes/product"; // Agregar rutas de productos
import TransporterRoutes from './routes/transporter';
//import productRoutes from "./routes/product"; // Agregar rutas de productos
import IARoute from './routes/IA';
import ChatRoutes from './routes/chat';

dotenv.config();
const app = express().use(bodyParser.json());
const PORT = process.env.PORT || 10101;

app.use('/usuario', userRoutes);
app.use('/vendedor', SellerRoutes);
app.use('/transportador', TransporterRoutes);
// app.use('/admin');

// app.use('/comprador');
app.use('/transportador', TransporterRoutes);
// app.use('/producto');
// app.use('/compra');
app.use('/chat', ChatRoutes);
app.use('/IA', IARoute)

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error: { message: string | undefined; }) => {
    throw new Error(error.message);
});
