const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const otps = {};

app.post("/auth/send-code", (req, res) => {
    console.log("📥 Requisição recebida em /auth/send-code");

    const { phone } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otps[phone] = code;

    console.log("================================");
    console.log(`📲 CÓDIGO GERADO PARA ${phone}: ${code}`);
    console.log("================================");

    res.json({ message: "Código gerado" });
});

app.listen(3000, () => {
    console.log("✅ BACKEND RODANDO NA PORTA 3000");
});
