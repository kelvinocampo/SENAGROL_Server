import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import IARepository from "../Repositories/IARepository";
import { FRONT_ROUTES } from "../Data/FrontRoutes";
dotenv.config();

const { APIKEY = "" } = process.env;
const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class IAService {
    static async classifyResponse(promp: string) {
        try {
            const response = await model.generateContent({
                prompt: promp,
                temperature: 0.2,
                maxOutputTokens: 1000,
            });

            const text = response.candidates[0].content;
            return classification;
        } catch (error) {
            console.error("Error generating content:", error);
            throw new Error("Failed to generate content");
        }
    }
}

export default IAService;