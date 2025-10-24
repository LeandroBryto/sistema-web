import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-caixa',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './caixa.html',
  styleUrls: ['./caixa.scss']
})
export class Caixa {}