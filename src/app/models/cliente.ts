export interface Cliente {
  id?: number;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
}

export interface Venda {
  id: number;
  data?: string;
  total?: number;

}
