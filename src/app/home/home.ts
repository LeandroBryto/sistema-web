import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';

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
    ChartModule
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

  constructor() {
    // Registrar todos os componentes do Chart.js
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.initChart();
    
    this.timeRangeOptions = [
      { label: 'Últimos 7 dias', value: '7d' },
      { label: 'Último Mês', value: '30d' }
    ];
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

  // Você pode adicionar um método para atualizar o gráfico
  // quando o selectedTimeRange mudar, por exemplo:
  onTimeRangeChange(event: any) {
    console.log('Período selecionado:', event.value);
    // Aqui você faria a lógica para buscar novos dados
    // e atualizar this.chartData
  }
}
