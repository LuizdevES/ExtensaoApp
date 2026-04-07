var express = require("express");
var router = express.Router();
const db = require("../dados/GestorDB");

/* =========================================
   ROTA RAIZ — Página de Status da API
   =========================================*/
router.get("/", async (req, res) => {
  let statusMongo = "🟢 Conectado";
  let totalProdutos = "—";
  let totalClientes = "—";
  let totalPedidos = "—";

  try {
    const [produtos, clientes, pedidos] = await Promise.all([
      db.findAllProduto(),
      db.findAllCliente(),
      db.findAllPedido()
    ]);
    totalProdutos = produtos.length;
    totalClientes = clientes.length;
    totalPedidos  = pedidos.length;
  } catch (e) {
    statusMongo = "🔴 Erro ao conectar";
  }

  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MinhaAPI – Status</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0f1117; color: #e0e0e0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; }
    h1 { font-size: 2rem; color: #ff6600; margin-bottom: 4px; }
    .sub { color: #888; font-size: 0.9rem; margin-bottom: 40px; }
    .cards { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-bottom: 40px; }
    .card { background: #1a1d2e; border-radius: 12px; padding: 24px 32px; min-width: 160px; text-align: center; border: 1px solid #2a2d3e; }
    .card .num { font-size: 2.5rem; font-weight: bold; color: #ff6600; }
    .card .label { font-size: 0.85rem; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .status-bar { background: #1a1d2e; border-radius: 12px; padding: 16px 24px; border: 1px solid #2a2d3e; width: 100%; max-width: 500px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .routes { background: #1a1d2e; border-radius: 12px; padding: 24px; max-width: 500px; width: 100%; border: 1px solid #2a2d3e; }
    .routes h2 { font-size: 1rem; color: #ff6600; margin-bottom: 16px; }
    .route { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #2a2d3e; font-size: 0.85rem; }
    .route:last-child { border-bottom: none; }
    .badge { padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
    .get  { background: #1a4731; color: #2ecc71; }
    .post { background: #2d2100; color: #f39c12; }
    .put  { background: #1a2e4a; color: #3498db; }
    .del  { background: #3a1010; color: #e74c3c; }
    .footer { margin-top: 40px; color: #555; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>🍕 MinhaAPI</h1>
  <p class="sub">API de Gestão da Loja — Servidor Ativo</p>

  <div class="cards">
    <div class="card"><div class="num">${totalProdutos}</div><div class="label">Produtos</div></div>
    <div class="card"><div class="num">${totalClientes}</div><div class="label">Clientes</div></div>
    <div class="card"><div class="num">${totalPedidos}</div><div class="label">Pedidos</div></div>
  </div>

  <div class="status-bar">
    <span>MongoDB</span>
    <span>${statusMongo}</span>
  </div>

  <div class="routes">
    <h2>Rotas Disponíveis</h2>
    <div class="route"><span class="badge get">GET</span>/produtos</div>
    <div class="route"><span class="badge post">POST</span>/produtos/new</div>
    <div class="route"><span class="badge put">PUT</span>/produtos/update/:id</div>
    <div class="route"><span class="badge del">DEL</span>/produtos/remove/:id</div>
    <div class="route"><span class="badge get">GET</span>/clientes</div>
    <div class="route"><span class="badge post">POST</span>/clientes/new</div>
    <div class="route"><span class="badge put">PUT</span>/clientes/update/:id</div>
    <div class="route"><span class="badge del">DEL</span>/clientes/remove/:id</div>
    <div class="route"><span class="badge get">GET</span>/pedidos</div>
    <div class="route"><span class="badge post">POST</span>/pedidos/new</div>
    <div class="route"><span class="badge put">PUT</span>/pedidos/update/:id</div>
    <div class="route"><span class="badge del">DEL</span>/pedidos/remove/:id</div>
  </div>

  <p class="footer">Última verificação: ${agora}</p>
</body>
</html>`);
});

router.get("/produtos", async (req, res, next) => {
  try {
    const docs = await db.findAllProduto();
    res.send(docs);
  } catch (err) {
    res.send({ resultado: "Erro ao Listar", mensagem: err });
  }
});

router.post("/produtos/new", async (req, res, next) => {
  const nomeProduto = req.body.nomeProduto;
  const precoProduto = parseFloat(req.body.precoProduto);
  try {
    await db.insertProduto({ nomeProduto, precoProduto });
    res.send({ resultado: "Inserido com sucesso" });
  } catch (err) {
    res.send({ resultado: "Erro ao inserir", mensagem: err });
  }
});

router.put("/produtos/update/:id", async (req, res, next) => {
  const idProduto = req.params.id;
  const nomeProduto = req.body.nomeProduto;
  const precoProduto = parseFloat(req.body.precoProduto);
  try {
    await db.updateProduto(idProduto, { nomeProduto, precoProduto });
    res.send({ resultado: "Alterado com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao alterar.", mensagem: err });
  }
});

router.delete("/produtos/remove/:id", async (req, res, next) => {
  const idProduto = req.params.id;
  try {
    await db.deleteOneProduto(idProduto);
    res.send({ resultado: "Removido com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao remover", mensagem: err });
  }
});

// Rota Cliente

router.get("/clientes", async (req, res, next) => {
  try {
    const docs = await db.findAllCliente();
    res.send(docs);
  } catch (err) {
    res.send({ resultado: "Erro ao listar Clientes", mensagem: err });
  }
});

router.post("/clientes/new", async (req, res, next) => {
  const nomeCliente = req.body.nomeCliente;
  const telefone = req.body.telefone;

  try {
    await db.insertCliente({ nomeCliente, telefone });
    res.send({ resultado: "Cliente inserido com sucesso! " });
  } catch (err) {
    res.send({ resultado: "Erro ao inserir Cliente", mensagem: err });
  }
});

router.put("/clientes/update/:id", async (req, res, next) => {
  const idCliente = req.params.id;
  const dadosAtualizados = {
    nomeCliente: req.body.nomeCliente,
    telefone: req.body.telefone,
  };
  try {
    await db.updateCliente(idCliente, dadosAtualizados);
    res.send({ resultado: "Alterado com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao alterar.", mensagem: err });
  }
});

router.delete("/clientes/remove/:id", async (req, res, next) => {
  const _id = req.params.id;
  try {
    await db.deleteOneCliente(_id);
    res.send({ resultado: "Cliente removido com sucesso! " });
  } catch (err) {
    res.send({ resultado: "Erro ao remover Cliente", mensagem: err });
  }
});

// Rotas de Pedidos

router.get("/pedidos", async (req, res, next) => {
  try {
    const docs = await db.findAllPedido();
    res.send(docs);
  } catch (err) {
    res.send({ resultado: "Erro ao Listar Pedidos", mensagem: err });
  }
});

router.post("/pedidos/new", async (req, res, next) => {
  const pedido = req.body;
  pedido._id = parseInt(pedido.idPedido);

  try {
    await db.insertPedido(pedido);
    res.send({ resultado: "Pedido salvo na Cozinha com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao Inserir Pedido", mensagem: err });
  }
});

router.put("/pedidos/update/:id", async (req, res, next) => {
  const idPedido = parseInt(req.params.id);
  const dadosAtualizados = {
    nomeCliente: req.body.nomeCliente,
    itens: req.body.itens,
    quantidade: req.body.quantidade,
    valorTotal: req.body.valorTotal,
    statusPagamento: req.body.statusPagamento,
  };

  try {
    await db.updatePedido(idPedido, dadosAtualizados);
    res.send({ resultado: "Pedido alterado com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao Alterar Pedido", mensagem: err });
  }
});

router.delete("/pedidos/remove/:id", async (req, res, next) => {
  const idPedido = parseInt(req.params.id);
  try {
    await db.deleteOnePedido(idPedido);
    res.send({ resultado: "Pedido cancelado com sucesso!" });
  } catch (err) {
    res.send({ resultado: "Erro ao Remover Pedido", mensagem: err });
  }
});

module.exports = router;
