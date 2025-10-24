import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './financeiro.html',
  styleUrls: ['./financeiro.scss']
})
export class Financeiro {}