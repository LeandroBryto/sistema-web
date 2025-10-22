import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-padaria',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule],
  templateUrl: './padaria.html',
  styleUrl: './padaria.scss'
})
export class Padaria {}