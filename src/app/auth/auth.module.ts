import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';

// Component standalone
import { LoginComponent } from './login/login';

@NgModule({
  // declarations removidas: Login é standalone
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild([{ path: 'login', component: LoginComponent }]),
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    DividerModule,
    RippleModule,
    ToastModule,
    InputMaskModule,
    // Importa explicitamente o standalone para exportar (opcional)
    LoginComponent,
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    DividerModule,
    RippleModule,
    ToastModule,
    InputMaskModule,
    LoginComponent,
  ],
  providers: [MessageService]
})
export class AuthModule {}