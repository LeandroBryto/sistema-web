import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-vendas',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './vendas.html',
  styleUrl: './vendas.scss'
})
export class Vendas {}