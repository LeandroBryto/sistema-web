import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  signOut(): void {
    try {
      if (typeof window === 'undefined' || !window?.localStorage) return;
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch (e) {
      // ambiente sem DOM (SSR) — ignorar
    }
  }

  saveToken(token: string): void {
    try {
      if (typeof window === 'undefined' || !window?.localStorage) return;
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      // ambiente sem DOM (SSR) — ignorar
    }
  }

  getToken(): string | null {
    try {
      if (typeof window === 'undefined' || !window?.localStorage) return null;
      return window.localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }

  saveUser(user: any): void {
    try {
      if (typeof window === 'undefined' || !window?.localStorage) return;
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      // ambiente sem DOM (SSR) — ignorar
    }
  }

  getUser(): any {
    try {
      if (typeof window === 'undefined' || !window?.localStorage) return null;
      const user = window.localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}
