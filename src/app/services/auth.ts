import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, RecoverPasswordRequest, AuthResponse } from '../models/auth';

@Injectable() 
export class AuthService {
  private apiUrl = `${environment.authBaseUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, this.getHttpOptions());
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user, this.getHttpOptions());
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, data, {
      ...this.getHttpOptions(),
      responseType: 'text'
    });
  }
}
