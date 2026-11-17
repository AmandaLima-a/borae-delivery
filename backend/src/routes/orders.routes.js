const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.product_id,
              'name', oi.product_name,
              'quantity', oi.quantity,
              'price', oi.unit_price,
              'observation', oi.observation
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    const orders = result.rows.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        cep: order.cep,
        street: order.street,
        number: order.address_number,
        complement: order.complement,
        neighborhood: order.neighborhood,
      },
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      total: Number(order.total),
      paymentMethod: order.payment_method,
      needsChange: order.needs_change,
      changeFor: order.change_for,
      status: order.status,
    }));

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);

    res.status(500).json({
      erro: "Não foi possível buscar os pedidos.",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const {
      orderNumber,
      customer,
      items,
      total,
      paymentMethod,
      needsChange,
      changeFor,
      status,
    } = req.body;

    if (
      !Number.isInteger(Number(orderNumber)) ||
      Number(orderNumber) <= 0 ||
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.cep ||
      !customer.street ||
      !customer.number ||
      !customer.neighborhood ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !paymentMethod
    ) {
      return res.status(400).json({
        erro: "Dados do pedido incompletos ou inválidos.",
      });
    }

    if (
      items.some(
        (item) =>
          !Number.isInteger(Number(item.id)) ||
          Number(item.id) <= 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0
      )
    ) {
      return res.status(400).json({
        erro: "Um ou mais produtos possuem dados inválidos.",
      });
    }

    let client;

    try {
      client = await pool.connect();

      await client.query("BEGIN");

      const productIds = items.map((item) => Number(item.id));

      const productsResult = await client.query(
        `SELECT id, name, price, is_active
        FROM products
        WHERE id = ANY($1::int[])`,
        [productIds]
      );

      const productsMap = new Map(
        productsResult.rows.map((product) => [product.id, product])
      );

      const invalidProduct = items.some((item) => {
        const product = productsMap.get(Number(item.id));

        return !product || !product.is_active;
      });

      if (invalidProduct) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          erro: "Um ou mais produtos não existem ou estão indisponíveis.",
        });
      }

      const validatedItems = items.map((item) => {
        const product = productsMap.get(Number(item.id));

        return {
          ...item,
          name: product.name,
          price: Number(product.price),
        };
      });

      const calculatedTotal = validatedItems.reduce(
        (total, item) => total + item.price * Number(item.quantity),
        0
      );

      const orderResult = await client.query(
        `INSERT INTO orders (
          order_number,
          customer_name,
          customer_phone,
          cep,
          street,
          address_number,
          complement,
          neighborhood,
          payment_method,
          needs_change,
          change_for,
          total,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          orderNumber,
          customer.name,
          customer.phone,
          customer.cep,
          customer.street,
          customer.number,
          customer.complement || null,
          customer.neighborhood,
          paymentMethod,
          needsChange,
          changeFor || null,
          calculatedTotal,
          status || "Pedido recebido",
        ]
      );

      const orderId = orderResult.rows[0].id;

      for (const item of validatedItems) {
        await client.query(
          `INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            observation
          )
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId,
            item.id,
            item.name,
            item.quantity,
            item.price,
            item.observation || null,
          ]
        );
      }

      await client.query("COMMIT");

      res.status(201).json({
        mensagem: "Pedido registrado com sucesso!",
        pedido: orderResult.rows[0],
      });

    } catch (error) {
      if (client) {
        await client.query("ROLLBACK");
      }

      throw error;

    } finally {
      if (client) {
        client.release();
      }
    }

  } catch (error) {
    console.error("Erro ao criar pedido:", error);

    res.status(500).json({
      erro: "Não foi possível registrar o pedido.",
    });
  }
});

module.exports = router;