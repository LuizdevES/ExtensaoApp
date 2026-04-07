import { Cliente } from "./Cliente";
import api from "../../ApiService";

export default class ClienteDAO {
  async adicionarCliente(cliente: Cliente) {
    try {
      const result = await api.post("/clientes/new", cliente);
      console.log("Salvo na API com sucesso!", result.data);
      return true;
    } catch (error) {
      console.error("Erro ao salvar na API: ", error);
      return false;
    }
  }

  async listarCliente() {
    try {
      const result = await api.get("/clientes");
      const listaMapeada = result.data.map(
        (linha: any) => new Cliente(0, linha.nomeCliente, linha.telefone),
      );
      return listaMapeada;
    } catch (error) {
      console.log("Erro ao listar na nuvem: ", error);
      return [];
    }
  }

  async excluirCliente(id: number) {
    try {
      await api.delete(`/clientes/remove/${id}`);
      console.log("Cliente excluído com sucesso! ID:", id);
      return true;
    } catch (error) {
      console.log("Erro ao exluir na nuuvem: ", error);
      return false;
    }
  }

  async alterarCliente(cliente: Cliente) {
    try {
      await api.put(`/clientes/update/${cliente.idCliente}`, {
        nomeCliente: cliente.nomeCliente,
        telefone: cliente.telefone,
      });
      console.log("Produto alterado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao alterar na nuvem: ", error);
      return false;
    }
  }
}
