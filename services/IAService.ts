import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const { APIKEY = "" } = process.env;

const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Mi nombre es Kevin y Tengo 16 años" }],
        },
        {
            role: "model",
            parts: [{ text: "Hola Kevin, ¿en qué puedo ayudarte hoy?" }],
        },
    ],
});

class IAService {
    static async request(prompt: string) {
        try {
            // Enviar el mensaje al chat y obtener la respuesta en streaming
            const result = await chat.sendMessageStream(prompt);

            let responseText = "";

            // Concatenar la respuesta en streaming chunk por chunk
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                responseText += chunkText;
            }

            return responseText;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al enviar el mensaje:", error.message);
                throw new Error(error.message);
            } else {
                console.error("Error desconocido:", error);
                throw new Error("Ocurrió un error desconocido");
            }
        }
    }
}

export default IAService;