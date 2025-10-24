import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria-estoque',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss']
})
export class Estoque {}