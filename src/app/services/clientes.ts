import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private apiUrl = 'http://localhost:8081/api/clientes';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  listAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}`, cliente, this.getHttpOptions());
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, this.getHttpOptions());
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  historico(id: number): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/${id}/historico`);
  }
}
