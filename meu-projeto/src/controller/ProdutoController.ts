import ProdutoDAO from "../model/ProdutoDAO";
import { Produto } from "../model/Produto";

export default class ProdutoController {
  private dao: ProdutoDAO;

  constructor() {
    this.dao = new ProdutoDAO();
  }

  async adicionarProduto(nomeProduto: string, precoProduto: string) {
    try {
      const precoNum = parseFloat(precoProduto);
      const novoProduto = new Produto(0, nomeProduto, precoNum);

      const idInserido = await this.dao.adicionarProduto(novoProduto);
      return idInserido;
    } catch (error) {
      console.error("Erro no Controller: ", error);
      throw error;
    }
  }

  async listarProduto() {
    try {
      const produtos = await this.dao.listarProduto();
      return produtos;
    } catch (error) {
      console.error("Erro ao listar no Controller: ", error);
      return [];
    }
  }

  async alterarProduto(produto: Produto) {
    try {
      await this.dao.alterarProduto(produto);
      return true;
    } catch (error) {
      console.error("Erro ao alterar no Controller: ", error);
    }
  }

  async excluirProduto(idProduto: any) {
    try {
      await this.dao.excluirProduto(idProduto);
      return true;
    } catch (error) {
      console.log("Erro ao excluir no Controller: ", error);
      return false;
    }
  }
}
