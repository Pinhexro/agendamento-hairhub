require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Erro MongoDB:", err));

app.get("/", (req, res) => {
    res.send("API HairHub online 🚀");
});

// Modelo agendamento MongoDB
const AgendamentoSchema = new mongoose.Schema({
    cliente: String,
    telefone: String,
    servico: String,
    valor: Number,
    data: String,
    hora: String,
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

const Agendamento = mongoose.model("Agendamento", AgendamentoSchema);

// Agendamentos
app.get("/agendamentos", async (req, res) => {
    const dados = await Agendamento.find();
    res.json(dados);
});

// Criar agendamento
app.post("/agendamentos", async (req, res) => {
    const { nome, telefone, servico, data, hora } = req.body;

    const conflito = await Agendamento.findOne({ data, hora });
    if (conflito) {
        return res.status(409).json({ error: "Horário ocupado" });
    }

    await Agendamento.create({ nome, telefone, servico, data, hora });
    res.status(201).json({ message: "Agendamento criado" });
});

// Cancelar agendamento
app.delete("/agendamentos/:id", async (req, res) => {
    await Agendamento.findByIdAndDelete(req.params.id);
    res.json({ message: "Agendamento removido" });
});

// Porta (RENDER)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta", PORT);
});
