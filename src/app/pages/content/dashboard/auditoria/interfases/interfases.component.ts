import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-interfases',
  templateUrl: './interfases.component.html',
  styleUrls: ['./interfases.component.css']
})

export class InterfasesComponent implements OnInit {

  maxDate: Date = new Date();

  constructor(private spinner: NgxSpinnerService) {
  }

  setPantalla(tipo: string): void {
    localStorage.setItem('tipoPantalla', tipo);
  }

  botonActivado = (comparar: string): boolean => {
    return localStorage.getItem('tipoPantalla') === comparar
      ? true
      : false;
  }

  ngOnInit(): void {
    this.spinner.show();
    localStorage.setItem('tipoPantalla', 'INTERFASES');
    const visualUno = new Chart('visualUno', {
      type: 'pie',
      data: {
        labels: ['Arranque Automático', 'Arranque Manual'],
        datasets: [{
          label: 'Inicio',
          data: [647, 162],
          backgroundColor: [
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 2
        }]
      }
    });
    const visualDos = new Chart('visualDos', {
      type: 'pie',
      data: {
        labels: ['Red Days Todos', 'Green Days Todos'],
        datasets: [{
          data: [4, 18],
          backgroundColor: [
            '#ffd6d6',
            '#d7ffd6'
          ],
          borderColor: [
            '#ff7a7a',
            '#55bd4a'
          ],
          borderWidth: 2
        }]
      }
    });
    this.spinner.hide();

    const data = [{ x: 'Enero', net: 100, cogs: 50, gm: 50 }, { x: 'Febrero', net: 100, cogs: 55, gm: 75 }];
    const myChart = new Chart('ctx', {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero'],
        datasets: [{
          label: 'Todos',
          data: data,
          parsing: {
            yAxisKey: 'net'
          }
        }, {
          label: 'TI',
          data: data,
          parsing: {
            yAxisKey: 'cogs'
          },
          backgroundColor: [
            'rgba(0, 99, 132, 0.2)'],
          borderColor: [
            'rgb(0, 99, 132)']
        }, {
          label: 'Proveedores',
          data: data,
          parsing: {
            yAxisKey: 'gm'
          },
          backgroundColor: [
            'rgba(255, 0, 132, 0.2)'],
          borderColor: [
            'rgb(255, 0, 132)']
        },
        ],
      },
      options: {
        animation: false,
        normalized: true,
        responsive: true,
        skipNull: true,
        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        interaction: {
          mode: 'index',
          axis: 'y'
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


    const myChartRadar = new Chart('radar', {
      type: 'radar',
      data: {
        labels: [
          'MO',
          'MD',
          'AIMS Y EXCEDENTES',
          'CAJA AFORE',
          'INT CASH'
        ],
        datasets: [{
          label: 'Red Days TI',
          data: [4, 6, 8, 5, 3],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
          label: 'Green Days TI',
          data: [14, 13, 20, 17, 14],
          backgroundColor: '#d7ffd6',
          borderColor: '#55bd4a',
          pointBackgroundColor: '#55bd4a',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#55bd4a'
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        }
      },
    });
  }


}
