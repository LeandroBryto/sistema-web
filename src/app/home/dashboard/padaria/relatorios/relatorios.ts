import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-relatorios',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss'
})
export class Relatorios {}