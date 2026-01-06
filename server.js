require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// MONGO DB
// ==============================
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Erro MongoDB:", err));

// ==============================
// ROTA RAIZ (OBRIGATÓRIA)
// ==============================
app.get("/", (req, res) => {
    res.send("API HairHub online 🚀");
});

// ==============================
// MODELO
// ==============================
const AgendamentoSchema = new mongoose.Schema({
    nome: String,
    telefone: String,
    servico: String,
    data: String,
    hora: String
});

const Agendamento = mongoose.model("Agendamento", AgendamentoSchema);

// ==============================
// ROTAS
// ==============================
app.get("/agendamentos", async (req, res) => {
    const dados = await Agendamento.find();
    res.json(dados);
});

app.post("/agendamentos", async (req, res) => {
    const { nome, telefone, servico, data, hora } = req.body;

    const conflito = await Agendamento.findOne({ data, hora });
    if (conflito) {
        return res.status(409).json({ error: "Horário ocupado" });
    }

    await Agendamento.create({ nome, telefone, servico, data, hora });
    res.status(201).json({ message: "Agendamento criado" });
});

app.delete("/agendamentos/:id", async (req, res) => {
    await Agendamento.findByIdAndDelete(req.params.id);
    res.json({ message: "Agendamento removido" });
});

// ==============================
// PORTA (RENDER)
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta", PORT);
});
