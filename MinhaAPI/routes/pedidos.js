const express = require("express");
const router = express.Router();
const gestorDB = require("../dados/GestorDB");

router.get("/", async function (req, res, next) {
  try {
    const pedidos = await gestorDB.findAllPedido();
    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.post("/new", async function (req, res, next) {
  try {
    const { nomeCliente, itens, quantidade, valorTotal, dataPedido, statusPagamento } = req.body;

    const novoPedido = {
      nomeCliente,
      itens,
      quantidade,
      valorTotal,
      dataPedido: dataPedido || new Date().toISOString(),
      statusPagamento: statusPagamento || "aguardando"
    };

    const resultado = await gestorDB.insertPedido(novoPedido);
    res
      .status(201)
      .json({ message: "Pedido salvo com sucesso", id: resultado.insertedId });
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    res.status(500).json({ error: "Erro ao salvar pedido no banco de dados." });
  }
});

router.put("/update/:id", async function(req, res, next) {
  try {
    const id = req.params.id;
    const dados = req.body;
    
    // Converte a string do id para ObjectId do MongoDB
    const objectId = new (require("mongodb").ObjectId)(id);
    
    await gestorDB.updatePedido(objectId, dados);
    res.json({ message: "Pedido alterado com sucesso" });
  } catch (error) {
    console.error("Erro ao alterar pedido:", error);
    res.status(500).json({ error: "Erro ao alterar pedido no banco." });
  }
});

module.exports = router;
