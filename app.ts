import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

import userRoutes from './routes/user';
import TransporterRoutes from './routes/transporter';
//import productRoutes from "./routes/product"; // Agregar rutas de productos
import IARoute from './routes/IA';

dotenv.config();
const app = express().use(bodyParser.json());
const PORT = process.env.PORT || 10101;

app.use('/usuario', userRoutes);
// app.use('/admin');
// app.use('/vendedor');
// app.use('/comprador');
app.use('/transportador', TransporterRoutes);
// app.use('/producto');
// app.use('/compra');
// app.use('/chat');
app.use('/IA', IARoute)

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error: { message: string | undefined; }) => {
    throw new Error(error.message);
});