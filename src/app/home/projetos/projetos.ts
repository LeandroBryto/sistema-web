import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './projetos.html',
  styleUrls: ['./projetos.scss']
})
export class Projetos {}