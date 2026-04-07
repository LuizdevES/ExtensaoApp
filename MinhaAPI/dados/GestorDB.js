const mongoClient = require("mongodb").MongoClient;

mongoClient
  .connect("mongodb://127.0.0.1:27017")
  .then((conn) => {
    global.conn = conn.db("loja");
    console.log("Conectado ao MongoDB!");
  })
  .catch((err) => console.log(err));

// =======================
// Módulo de produtos
// =======================
function findAllProduto() {
  return global.conn.collection("produtos").find().toArray();
}
function insertProduto(produto) {
  return global.conn.collection("produtos").insertOne(produto);
}
function updateProduto(id, dadosAtualizados) {
  return global.conn
    .collection("produtos")
    .updateOne({ _id: id }, { $set: dadosAtualizados });
}
function deleteOneProduto(id) {
  return global.conn.collection("produtos").deleteOne({ _id: id });
}

// =======================
// Módulo de Clientes
// =======================
function findAllCliente() {
  return global.conn.collection("clientes").find().toArray();
}
function insertCliente(cliente) {
  return global.conn.collection("clientes").insertOne(cliente);
}
function updateCliente(id, dadosAtualizados) {
  return global.conn
    .collection("clientes")
    .updateOne({ _id: id }, { $set: dadosAtualizados });
}
function deleteOneCliente(id) {
  return global.conn.collection("clientes").deleteOne({ _id: id });
}

// =======================
// Módulo de Pedidos
// =======================
function findAllPedido() {
  return global.conn.collection("pedidos").find().toArray();
}
function insertPedido(pedido) {
  return global.conn.collection("pedidos").insertOne(pedido);
}
function updatePedido(id, dadosAtualizados) {
  return global.conn
    .collection("pedidos")
    .updateOne({ _id: id }, { $set: dadosAtualizados });
}
function deleteOnePedido(idPedido) {
  return global.conn.collection("pedidos").deleteOne({ _id: idPedido });
}

module.exports = {
  findAllProduto,
  insertProduto,
  updateProduto,
  deleteOneProduto,
  findAllCliente,
  insertCliente,
  updateCliente,
  deleteOneCliente,
  findAllPedido,
  insertPedido,
  updatePedido,
  deleteOnePedido,
};
