export class Cliente {
  idCliente: number;
  nomeCliente: string;
  telefone: string;

  constructor(idCliente: number, nomeCliente: string, telefone: string) {
    this.idCliente = idCliente;
    this.nomeCliente = nomeCliente;
    this.telefone = this.formatarTelefone(telefone);
  }
  private formatarTelefone(telefoneSimples: string): string {
    let telefoneLimpo = telefoneSimples.replace(/\D/g, "");
    const regex = /^[1,3, 10-15]{10,11}$/;
    if (regex.test(telefoneLimpo)) {
      return "55" + telefoneLimpo;
    }
    return telefoneLimpo;
  }
}
