const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* Listar agendamentos */
app.get("/agendamentos", (req, res) => {
    const db = readDB();
    res.json(db.agendamentos);
});

/* Criar agendamento */
app.post("/agendamentos", (req, res) => {
    const { servico, data, hora } = req.body;

    if (!servico || !data || !hora) {
        return res.status(400).json({ error: "Dados incompletos" });
    }

    const db = readDB();

    const horarioOcupado = db.agendamentos.some(
        a => a.data === data && a.hora === hora
    );

    if (horarioOcupado) {
        return res.status(409).json({ error: "Horário já ocupado" });
    }

    const novo = {
        id: uuid(),
        servico,
        data,
        hora
    };

    db.agendamentos.push(novo);
    writeDB(db);

    res.status(201).json(novo);
});

/* Cancelar agendamento */
app.delete("/agendamentos/:id", (req, res) => {
    const db = readDB();
    db.agendamentos = db.agendamentos.filter(a => a.id !== req.params.id);
    writeDB(db);
    res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend rodando na porta", PORT);
});
