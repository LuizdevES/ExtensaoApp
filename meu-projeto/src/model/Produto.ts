export class Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;

  constructor(idProduto: number, nomeProduto: string, precoProduto: number) {
    this.idProduto = idProduto;
    this.nomeProduto = nomeProduto;
    this.precoProduto = precoProduto;
  }
}
