import { Produto } from "./Produto";
import api from "../../ApiService";

export default class ProdutoDAO {
  async adicionarProduto(produto: Produto) {
    try {
      const result = await api.post("/produtos/new", {
        nomeProduto: produto.nomeProduto,
        precoProduto: produto.precoProduto,
      });
      console.log("Salvo na API com sucesso!", result.data);
      return true;
    } catch (error) {
      console.error("Erro ao salvar na API: ", error);
      return false;
    }
  }

  async listarProduto() {
    try {
      const result = await api.get("/produtos");

      const listaMapeada = result.data.map(
        (linha: any) =>
          new Produto(linha._id, linha.nomeProduto, linha.precoProduto),
      );
      return listaMapeada;
    } catch (error) {
      console.log("Erro ao listar na nuvem: ", error);
      return [];
    }
  }

  async excluirProduto(idProduto) {
    try {
      await api.delete(`/produtos/remove/${idProduto}`);
      console.log("Produto excluído com sucesso! ID: ", idProduto);
      return true;
    } catch (error) {
      console.log("Erro ao excluir na nuvem: ", error);
      return false;
    }
  }

  async alterarProduto(produto: Produto) {
    try {
      await api.put(`/produtos/update/${produto.idProduto}`, {
        nomeProduto: produto.nomeProduto,
        precoProduto: produto.precoProduto,
      });
      console.log("Produto alterado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao alterar na nuvem: ", error);
      return false;
    }
  }
}
