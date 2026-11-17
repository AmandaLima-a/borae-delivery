const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productsRoutes);

app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API do Boraê está funcionando!");
});

app.get("/teste-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      mensagem: "Conexão com PostgreSQL funcionando!",
      horario: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Falha na conexão com o banco." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});