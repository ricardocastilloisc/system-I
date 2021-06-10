import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-interfaces',
  templateUrl: './interfaces.component.html',
  styleUrls: ['./interfaces.component.css']
})

export class InterfacesComponent implements OnInit {


  // LINE
  public lineChartData: ChartDataSets[] = [
    { data: [70, 59, 85, 95, 150, 120, 90], label: 'Ejecuciones exitosas' },
    { data: [0, 5, 2, 10, 15, 7, 1], label: 'Ejecuciones fallidas' },
  ];
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public lineChartOptions: (ChartOptions ) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgba(75, 192, 192, 1)',
    },
    {
      borderColor:  'rgba(255, 99, 132, 1)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor() {
  }

  
  

  ngOnInit(): void {

    let PieChart = new Chart ('pieChart', {
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
              borderWidth: .8
          }]
      }
  });
  }

}
