import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-produtos',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos {}