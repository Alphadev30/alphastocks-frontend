import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {

  @Input() chartData: number[];
  @Input() chartLabels: string[];

  constructor() {
    this.chartData = [];
    this.chartLabels = [];
  }


  public barChartOptions = {
    responsive: true,
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
        beginAtZero: true
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    }
  };

  public barChartData = [
    {
     backgroundColor: 'rgba(169, 169, 169, 1.0)' // Dark grey color
    }
  ];
  // public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public barChartType = 'bar';
  // public barChartLegend = true;
  // public barChartData = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', backgroundColor: 'rgba(169, 169, 169, 1.0)' },
  // ];

}
