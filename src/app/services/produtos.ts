import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



export interface Produto {
  id: number;
  nome: string;
  preco?: number;
  descricao?: string;
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private apiUrl = `${environment.apiBaseUrl}/api/produtos`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  listAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}`, produto, this.getHttpOptions());
  }

  update(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto, this.getHttpOptions());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


