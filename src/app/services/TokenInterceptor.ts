import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS // Necessário para registrar no AppModule
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorage } from './token-storage';
// Importamos o nosso cofre de tokens

/**
 * Classe responsável por interceptar todas as requisições HTTP de saída
 * e anexar o Token JWT no cabeçalho 'Authorization' se o token existir.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenStorage: TokenStorage) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // 1. Tenta obter o token salvo do nosso cofre (TokenStorage)
    const token = this.tokenStorage.getToken();

    // 2. Se o token for encontrado, ele é adicionado à requisição.
    if (token != null) {
      // 3. A requisição é CLONADA (porque objetos de requisição são imutáveis no Angular)
      // e o novo cabeçalho é definido.
      request = request.clone({
        setHeaders: {
          // Padrão Bearer: Usado para JWT
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 4. Continua o fluxo da requisição HTTP (com ou sem o token no cabeçalho)
    return next.handle(request);
  }
}

// Variável de configuração: É a forma como dizemos ao Angular que
// este Interceptor deve ser usado no array de 'providers' do AppModule.
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
