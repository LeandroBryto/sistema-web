import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TokenStorage } from '../services/token-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    // Módulos Nativos
    CommonModule,
    FormsModule,
    RouterModule,

    // Módulos PrimeNG
    CardModule,
    AvatarModule,
    CardModule,
    SelectButtonModule,
    ChartModule,
    MenuModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  // --- Dados para o Gráfico ---
  chartData: any;
  chartOptions: any;

  // --- Opções do Seletor de Período ---
  timeRangeOptions: any[] = [];
  selectedTimeRange: string = '7d'; // Valor inicial

  // Usuário (avatar no topo direito)
  userInitials: string = '';
  menuItems: MenuItem[] = [];
  @ViewChild('userMenu') userMenu!: Menu;

  constructor(private tokenStorage: TokenStorage, private router: Router) {}

  ngOnInit() {
    // Se precisar, registre Chart.js
    try { Chart.register(...registerables); } catch {}

    // Inicializa dados do gráfico se necessário
    this.initChart();

    // Inicializa menu do usuário
    const user = this.tokenStorage.getUser();
    const name: string = user?.nome || user?.name || 'Usuário';
    this.userInitials = this.getInitials(name);

    this.menuItems = [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl('/auth/login');
  }

  private getInitials(fullName: string): string {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '';
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const primaryColor = documentStyle.getPropertyValue('--primary-color'); // Azul do PrimeNG
    const primaryColorLight = documentStyle.getPropertyValue('--primary-100'); // Azul claro

    // Dados baseados na imagem (estimados)
    this.chartData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Novos Usuários',
          data: [40, 110, 150, 135], // Estimativa dos pontos do gráfico
          fill: true,
          borderColor: primaryColor,
          tension: 0.4, // Para a curva suave
          backgroundColor: primaryColorLight
        }
      ]
    };

    // Opções de visualização do gráfico
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false // Sem legenda, como na imagem
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: false, // Remove linhas de grade verticais
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            stepSize: 50 // Intervalo de 50 em 50 no eixo Y
          },
          grid: {
            color: surfaceBorder // Linhas de grade horizontais
          }
        }
      }
    };
  }
}
