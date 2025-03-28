"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const seller_1 = __importDefault(require("./routes/seller"));
const product_1 = __importDefault(require("./routes/product"));
const transporter_1 = __importDefault(require("./routes/transporter"));
const IA_1 = __importDefault(require("./routes/IA"));
const chat_1 = __importDefault(require("./routes/chat"));
const admin_1 = __importDefault(require("./routes/admin"));
const buyer_1 = __importDefault(require("./routes/buyer"));
const buy_1 = __importDefault(require("./routes/buy"));
dotenv_1.default.config();
const app = (0, express_1.default)().use(body_parser_1.default.json());
const PORT = process.env.PORT || 10101;
app.use('/usuario', user_1.default);
app.use('/vendedor', seller_1.default);
app.use('/transportador', transporter_1.default);
app.use('/admin', admin_1.default);
app.use('/comprador', buyer_1.default);
app.use('/transportador', transporter_1.default);
app.use('/producto', product_1.default);
app.use('/compra', buy_1.default);
app.use('/chat', chat_1.default);
app.use('/IA', IA_1.default);
app.listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
}).on("error", (error) => {
    throw new Error(error.message);
});
