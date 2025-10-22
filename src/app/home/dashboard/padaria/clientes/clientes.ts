import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-clientes',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {}