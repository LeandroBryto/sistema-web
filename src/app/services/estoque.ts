import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produto, EntradaEstoqueDTO } from '../models/estoque';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private apiUrl = `${environment.apiBaseUrl}/api/estoque`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  // Listar todos os produtos do estoque
  listAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}`);
  }

  // Buscar produto por ID
  getById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  // Criar novo produto no estoque
  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}`, produto, this.getHttpOptions());
  }

  // Atualizar produto existente
  update(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto, this.getHttpOptions());
  }

  // Deletar produto do estoque
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Entrada de estoque (adicionar quantidade)
  entradaEstoque(entrada: EntradaEstoqueDTO): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/entrada`, entrada, this.getHttpOptions());
  }

  // Buscar produtos com estoque baixo
  produtosEstoqueBaixo(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/estoque-baixo`);
  }

  // Buscar produtos próximos ao vencimento
  produtosProximosVencimento(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/proximos-vencimento`);
  }
}