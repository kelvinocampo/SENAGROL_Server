import express from "express";
import dotenv from "dotenv";
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 10101;

app.use('/usuario', userRoutes);
app.use('/admin');
app.use('/vendedor');
app.use('/comprador');
app.use('/transportador');
app.use('/producto');
app.use('/compra');
app.use('/chat', chatRoutes);

app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error: { message: string | undefined; }) => {
    throw new Error(error.message);
});