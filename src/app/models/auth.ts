// Interfaces para garantir a segurança dos tipos (type-safety)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  senha: string;
  confirmaSenha: string;
}

export interface RecoverPasswordRequest {
  email: string;
  dataNascimento: string;
  novaSenha: string;
  confirmaNovaSenha: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  cpf: string;

  
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  roles: string[];
  modules: string[];
}
export interface ErrorResponse{
  status: number;
  erro: string;
  mensagem: string;
  path: string;
  timestamp: string;
  datalhes: string[] | null;
}
