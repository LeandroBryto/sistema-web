import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { TokenStorage } from '../../services/token-storage';
import { MessageService } from 'primeng/api';
import { LoginRequest, RegisterRequest, RecoverPasswordRequest, AuthResponse } from '../../models/auth';


import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    InputMaskModule,
  ],
  providers: [MessageService, AuthService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit { // Convenção: LoginComponent
  form!: FormGroup;
  formMode: 'LOGIN' | 'REGISTER' | 'RECOVER' = 'LOGIN';
  loading = false;
  today!: string;

  constructor(
    private fb: FormBuilder,
    // 2. SERVIÇOS ATUALIZADOS: Injetando os serviços com os nomes corretos
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Se o utilizador já tem um token, talvez queira redirecioná-lo
    if (this.tokenStorage.getToken()) {
        // this.router.navigateByUrl('/dashboard'); // Exemplo de redirecionamento
    }
    this.today = new Date().toISOString().split('T')[0];
    this.buildFormForMode(this.formMode);
  }

  changeMode(mode: 'LOGIN' | 'REGISTER' | 'RECOVER') {
    this.formMode = mode;
    this.buildFormForMode(mode);
  }

  // 3. FORMULÁRIOS COMPLETOS: Agora os formulários têm todos os campos da API
  private buildFormForMode(mode: 'LOGIN' | 'REGISTER' | 'RECOVER') {
    switch (mode) {
      case 'LOGIN':
        this.form = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          senha: ['', [Validators.required, Validators.minLength(8)]],
        });
        break;
      case 'REGISTER':
        this.form = this.fb.group({
          nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
          cpf: ['', [Validators.required, this.cpfValidator('cpfInvalid')]],
          telefone: ['', [Validators.required, this.digitsLengthValidator(10, 15, 'telefoneLength')]],
          dataNascimento: ['', [Validators.required, this.datePastValidator('dateNotPast')]],
          senha: ['', [Validators.required, Validators.minLength(8)]],
          confirmaSenha: ['', [Validators.required]],
        }, { validators: this.passwordMatchValidator('senha', 'confirmaSenha', 'mismatch') });
        break;
      case 'RECOVER':
        this.form = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          dataNascimento: ['', [Validators.required, this.datePastValidator('dateNotPast')]],
          novaSenha: ['', [Validators.required, Validators.minLength(8)]],
          confirmaNovaSenha: ['', [Validators.required]],
        }, { validators: this.passwordMatchValidator('novaSenha', 'confirmaNovaSenha', 'mismatchRecover') });
        break;
    }
  }

  // 4. VALIDADOR DE SENHAS: Garante que os campos de senha coincidem
  private passwordMatchValidator(controlName: string, matchingControlName: string, errorKey: string) {
    return (formGroup: AbstractControl) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (matchingControl?.errors && !matchingControl.errors[errorKey]) {
        return null;
      }
      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ [errorKey]: true });
        return { [errorKey]: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  submitForm() {
    if (this.form.invalid) {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }
    this.loading = true;

    const formValues = this.form.value;

    switch (this.formMode) {
      case 'LOGIN':
        const loginPayload: LoginRequest = { email: formValues.email, senha: formValues.senha };
        this.authService.login(loginPayload).subscribe({
            next: this.handleAuthSuccess,
            error: this.handleAuthError,
            complete: () => this.loading = false
        });
        break;
      case 'REGISTER':
        // O payload agora tem todos os campos do formulário
        this.authService.register(formValues as RegisterRequest).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada! Por favor, faça o login.' });
                this.changeMode('LOGIN');
            },
            error: this.handleAuthError,
            complete: () => this.loading = false
        });
        break;
      case 'RECOVER':
        this.authService.recoverPassword(formValues as RecoverPasswordRequest).subscribe({
            next: (responseMessage) => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: responseMessage });
                this.changeMode('LOGIN');
            },
            error: this.handleAuthError,
            complete: () => this.loading = false
        });
        break;
    }
  }

  private handleAuthSuccess = (data: AuthResponse) => {
    this.tokenStorage.saveToken(data.token);
    this.tokenStorage.saveUser(data); // O backend retorna os dados do utilizador
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Bem-vindo, ${data.nome}!` });
    this.router.navigateByUrl('/home'); // Redireciona para a página principal após o login
  }

  private handleAuthError = (err: any) => {
    // Tenta obter a mensagem de erro específica do backend
    const detail = err.error?.message || err.error || 'Ocorreu um erro inesperado. Tente novamente.';
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }

  private cpfValidator(errorKey: string) {
    return (control: AbstractControl) => {
      const value: string = control.value || '';
      const digits = value.replace(/\D/g, '');
      if (!digits) return null; // deixa required cuidar do vazio
      if (digits.length !== 11) return { [errorKey]: true };
      // invalida sequências repetidas
      if (/^(\d)\1{10}$/.test(digits)) return { [errorKey]: true };
      // cálculo dos dígitos verificadores
      const calcCheck = (base: string, factorStart: number) => {
        let sum = 0;
        for (let i = 0; i < base.length; i++) {
          sum += parseInt(base[i], 10) * (factorStart - i);
        }
        const rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
      };
      const base = digits.substring(0, 9);
      const d1 = calcCheck(base, 10);
      const d2 = calcCheck(base + d1, 11);
      const valid = digits.endsWith(`${d1}${d2}`);
      return valid ? null : { [errorKey]: true };
    };
  }

  private digitsLengthValidator(min: number, max: number, errorKey: string) {
    return (control: AbstractControl) => {
      const value: string = control.value || '';
      const digits = value.replace(/\D/g, '');
      if (!digits) return null; // deixa required cuidar do vazio
      return (digits.length >= min && digits.length <= max) ? null : { [errorKey]: true };
    };
  }

  private datePastValidator(errorKey: string) {
    return (control: AbstractControl) => {
      const value: string = control.value || '';
      if (!value) return null; // required cuida do vazio
      const today = new Date().toISOString().split('T')[0];
      return value < today ? null : { [errorKey]: true };
    };
  }
}
