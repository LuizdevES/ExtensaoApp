import PedidoDAO from "../model/PedidoDAO";
import { Pedido } from "../model/Pedido";

export default class PedidoController {
  private dao: PedidoDAO;

  constructor() {
    this.dao = new PedidoDAO();
  }

  async adicionarPedido(
    nomeCliente: string,
    itens: Array<any>,
    quantidade: number,
    valorTotal: number,
    dataPedido: Date,
    statusPagamento?: string
  ) {
    try {
      const novoPedido = new Pedido(
        Date.now(),
        nomeCliente,
        itens,
        quantidade,
        valorTotal,
        dataPedido,
        statusPagamento || "aguardando"
      );

      const sucesso = await this.dao.adicionar(novoPedido);
      return sucesso;
    } catch (error) {
      console.error("Erro no Controller: ", error);
      throw error;
    }
  }

  async listarPedido() {
    try {
      const pedidos = await this.dao.listarTodos();
      return pedidos;
    } catch (error) {
      console.error("Erro ao listar no Controller: ", error);
      return [];
    }
  }

  async alterarPedido(pedido: Pedido) {
    try {
      await this.dao.alterar(pedido);
      return true;
    } catch (error) {
      console.error("Erro ao alterar no Controller: ", error);
      return false;
    }
  }

  async excluirPedido(idPedido: number) {
    try {
      await this.dao.excluir(idPedido);
      return true;
    } catch (error) {
      console.log("Erro ao excluir no Controller: ", error);
      return false;
    }
  }
}
