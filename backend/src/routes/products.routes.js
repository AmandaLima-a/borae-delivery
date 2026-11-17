const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);

    res.status(500).json({
      erro: "Não foi possível buscar os produtos.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);

    res.status(500).json({
      erro: "Não foi possível buscar o produto.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        erro: "Nome, preço e categoria são obrigatórios.",
      });
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      return res.status(400).json({
        erro: "O preço deve ser um número maior que zero.",
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price, category, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);

    res.status(500).json({
      erro: "Não foi possível cadastrar o produto.",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        erro: "Nome, preço e categoria são obrigatórios.",
      });
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      return res.status(400).json({
        erro: "O preço deve ser um número maior que zero.",
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           category = $4,
           image = $5
       WHERE id = $6
       RETURNING *`,
      [name, description, price, category, image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    res.status(500).json({
      erro: "Não foi possível atualizar o produto.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    res.json({
      mensagem: "Produto excluído com sucesso!",
      produto: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);

    res.status(500).json({
      erro: "Não foi possível excluir o produto.",
    });
  }
});

module.exports = router;