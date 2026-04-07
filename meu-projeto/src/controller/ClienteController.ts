import ClienteDAO from "../model/ClienteDAO";
import { Cliente } from "../model/Cliente";

export default class ClienteController {
  private dao: ClienteDAO;

  constructor() {
    this.dao = new ClienteDAO();
  }

  async adicionarCliente(nomeCliente: string, telefone: string) {
    try {
      const novoCliente = new Cliente(0, nomeCliente, telefone);

      const idInserido = await this.dao.adicionarCliente(novoCliente);
      return idInserido;
    } catch (error) {
      console.error("Erro no Controller: ", error);
      throw error;
    }
  }

  async listarCliente() {
    try {
      const cliente = await this.dao.listarCliente();
      return cliente;
    } catch (error) {
      console.error("Erro ao listar no Controller: ", error);
      return [];
    }
  }

  async alterarCliente(cliente: Cliente) {
    try {
      await this.dao.alterarCliente(cliente);
      return true;
    } catch (error) {
      console.error("Erro ao alterar no Controller: ", error);
    }
  }

  async excluirCliente(id: number) {
    try {
      await this.dao.excluirCliente(id);
      return true;
    } catch (error) {
      console.log("Erro ao excluir no Controller: ", error);
      return false;
    }
  }
}
