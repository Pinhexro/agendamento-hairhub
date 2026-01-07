require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch(err => console.error("❌ Erro MongoDB:", err));

/* =========================
   ROTAS BÁSICAS
========================= */
app.get("/", (req, res) => {
    res.send("API HairHub online 🚀");
});

/* =========================
   SCHEMA & MODEL
========================= */
const AgendamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    servico: { type: String, required: true },
    data: { type: String, required: true },
    hora: { type: String, required: true },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

//Bloqueio real de con
AgendamentoSchema.index({ data: 1, hora: 1 }, { unique: true });

const Agendamento = mongoose.model("Agendamento", AgendamentoSchema);

/* =========================
   ROTAS DE AGENDAMENTO
========================= */

// Todos os agendamentos (admin/debug)
app.get("/agendamentos", async (req, res) => {
    try {
        const dados = await Agendamento.find().sort({ data: 1, hora: 1 });
        res.json(dados);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
});

// Meus agendamentos (por telefone)
app.get("/agendamentos/telefone/:telefone", async (req, res) => {
    try {
        const { telefone } = req.params;
        const agendamentos = await Agendamento.find({ telefone });
        res.json(agendamentos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
});

// Criar agendamento
app.post("/agendamentos", async (req, res) => {
    try {
        const { nome, telefone, servico, data, hora } = req.body;

        if (!nome || !telefone || !servico || !data || !hora) {
            return res.status(400).json({ error: "Dados incompletos" });
        }

        const novo = await Agendamento.create({
            nome,
            telefone,
            servico,
            data,
            hora
        });

        res.status(201).json({
            message: "Agendamento criado com sucesso",
            agendamento: novo
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: "Horário já ocupado" });
        }

        res.status(500).json({ error: "Erro ao criar agendamento" });
    }
});

// Cancelar agendamento
app.delete("/agendamentos/:id", async (req, res) => {
    try {
        await Agendamento.findByIdAndDelete(req.params.id);
        res.json({ message: "Agendamento removido" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao remover agendamento" });
    }
});

// Server Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta", PORT);
});
