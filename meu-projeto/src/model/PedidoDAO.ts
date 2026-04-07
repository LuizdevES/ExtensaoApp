import { Pedido } from "./Pedido";
import api from "../../ApiService";

export default class PedidoDAO {
  async adicionar(pedido: Pedido) {
    try {
      const result = await api.post("/pedidos/new", pedido);
      console.log("Pedido salvo na Nuvem com sucesso!", result.data);
      return true;
    } catch (error) {
      console.error("Erro ao salvar pedido na Nuvem: ", error);
      return false;
    }
  }

  async listarTodos() {
    try {
      const result = await api.get("/pedidos");

      const listaMapeada = result.data.map(
        (linha: any) =>
          new Pedido(
            linha._id,
            linha.nomeCliente,
            linha.itens,
            linha.quantidade,
            linha.valorTotal,
            linha.dataPedido,
            linha.statusPagamento
          ),
      );
      return listaMapeada;
    } catch (error) {
      console.log("Erro ao listar na nuvem: ", error);
      return [];
    }
  }

  async alterar(pedido: Pedido) {
    try {
      const result = await api.put(`/pedidos/update/${pedido.idPedido}`, {
        nomeCliente: pedido.nomeCliente,
        itens: pedido.itens,
        quantidade: pedido.quantidade,
        valorTotal: pedido.valorTotal,
        statusPagamento: pedido.statusPagamento
      });
      console.log("Pedido alterado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao alterar o pedido: ", error);
      return false;
    }
  }

  async excluir(idPedido: number) {
    try {
      await api.delete(`/pedidos/remove/${idPedido}`);
      console.log("Pedido excluído com sucesso! ID: ", idPedido);
      return true;
    } catch (error) {
      console.log("Erro ao excluir no servidor: ", error);
      return false;
    }
  }
}
