import { UnidadeMedida } from '../enums/unidadeMedida';
// Model completo do Produto com todos os campos do backend
export interface Produto {
    id: number;
    nome: string;
    codigoBarras: string;
    precoVenda: number;
    precoCusto: number;
    unidadeMedida: UnidadeMedida;
    estoqueAtual: number;
    estoqueMinimo: number;
    dataValidade: str; // ISO Date string
}

// DTO para entrada de estoque
export interface EntradaEstoqueDTO {
    produtoId: number;
    quantidade: number;
}

// Interface para o estoque (mantendo compatibilidade)
export interface Estoque {
    id: number;
    nome: string;
    codigoBarras: string;
    precoVenda: number;
    precoCusto: number;
    unidadeMedida: UnidadeMedida;
    estoqueAtual: number;
    estoqueMinimo: number;
    dataValidade?: string;
}