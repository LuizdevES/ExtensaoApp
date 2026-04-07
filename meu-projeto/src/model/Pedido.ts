export class Pedido {
  idPedido: number;
  nomeCliente: string;
  itens: Array<any>;
  quantidade: number;
  valorTotal: number;
  dataPedido: Date;
  statusPagamento?: string;

  constructor(
    idPedido: number,
    nomeCliente: string,
    itens: Array<any>,
    quantidade: number,
    valorTotal: number,
    dataPedido: Date,
    statusPagamento?: string
  ) {
    this.idPedido = idPedido;
    this.nomeCliente = nomeCliente;
    this.itens = itens;
    this.quantidade = quantidade;
    this.valorTotal = valorTotal;
    this.dataPedido = dataPedido;
    this.statusPagamento = statusPagamento || "aguardando";
  }
}
