import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 10101;
app.get("/", (request: Request, response: Response) => {
response.status(200).send("Hello World");
});
app.listen(PORT, () => {
console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error: { message: string | undefined; }) => {
throw new Error(error.message);
});