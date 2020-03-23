import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {

  @Input() chartLabels: Array<string>;
  @Input() chartData: Array<number>;
  @Input() title: string = '';

  barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false,
      labels: {
         fontColor: 'white',
         fontFamily: "`David Libre`, `serif`",
         fontSize: 20
      }
    },
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          lineWidth: 0.8,
          color: "#000",
          drawBorder: false,
        },
        ticks: {
          min: 0,
          fontColor: "#fff",
          fontSize: 20
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          lineWidth: 0.8,
          color: "#000",
          drawBorder: false,
        },
        ticks: {
          min: 0,
          fontColor: "#fff",
          fontSize: 20,
          stepSize: 10
        }
      }],
    }
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  private barChartData: ChartDataSets[] = [
    { 
      barPercentage: 0.6,
      maxBarThickness: 90,
      categoryPercentage: 1,
      data: null, 
      label: 'מנות שהוכנו לפי קטגוריות',
      backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(128, 0, 128, 0.5)', 'rgba(0, 128, 128, 0.5)'],
      borderColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(128, 0, 128, 0.5)', 'rgba(0, 128, 128, 0.5)'],
      borderWidth: 2,
      hoverBackgroundColor: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 0, 1)', 'rgba(128, 0, 128, 1)', 'rgba(0, 128, 128, 1)'],
      hoverBorderColor: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 0, 1)', 'rgba(128, 0, 128, 1)', 'rgba(0, 128, 128, 1)'],
      hoverBorderWidth: 2,
      barThickness: 'flex'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['chartData']){
      this.barChartData[0].data = changes['chartData'].currentValue;
    }
  }

}
