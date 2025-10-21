import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChartModule } from 'primeng/chart';
import { Chart, registerables } from 'chart.js';
import { TokenStorage } from '../../services/token-storage';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, AvatarModule, SelectButtonModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  chartData: any;
  chartOptions: any;

  timeRangeOptions: any[] = [];
  selectedTimeRange: string = '7d';

  userInitials: string = '';

  constructor(private tokenStorage: TokenStorage) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.initChart();
    this.timeRangeOptions = [
      { label: 'Últimos 7 dias', value: '7d' },
      { label: 'Último Mês', value: '30d' }
    ];

    const user = this.tokenStorage.getUser();
    const name: string = user?.nome || user?.name || '';
    this.userInitials = this.getInitials(name || 'Usuário');
  }

  onTimeRangeChange() {
    this.initChart();
  }

  private getInitials(fullName: string): string {
    // Remove espaços extras e divide por espaços
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '';
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  private initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const labels = this.selectedTimeRange === '30d'
      ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
      : ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'];

    const data = this.selectedTimeRange === '30d'
      ? [30, 60, 90, 120]
      : [20, 40, 60, 90, 70, 110, 95];

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Novos Usuários',
          data,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--primary-color'),
          tension: 0.4,
          backgroundColor: documentStyle.getPropertyValue('--primary-100')
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } }
      }
    };
  }
}