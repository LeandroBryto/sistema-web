import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-estoque',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.scss'
})
export class Estoque {}