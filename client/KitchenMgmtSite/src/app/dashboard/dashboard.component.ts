import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private fromDate: Date;
  private toDate: Date;
  private formError: boolean = false;
  private sumDishCooked: number = 0;
  private sumProductCost: number = 0;
  private cooks = [];
  private selectedCook = -1;
  private categories = [];
  
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
        display: false,
        ticks: {
          min: 0
        }
      }],
      yAxes: [{
        display: false,
        ticks: {
          min: 0
        }
      }],
    }
  };
  barChartLabels = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { 
      barPercentage: 0.8,
      categoryPercentage: 0.9,
      data: [], 
      label: 'מנות שהוכנו לפי קטגוריות',
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      hoverBorderColor: 'rgba(54, 162, 235, 1)',
      hoverBorderWidth: 2,
      barThickness: 'flex'
    }
  ];

  constructor(private kmws: KmwsService) {
    this.kmws.getCookNames()
      .subscribe(
        (data: any) => {
          if(!data.body || data.status != 200){
            this.cooks = [];
          }else{
            this.cooks = data.body.sort();
          }
        },
        err => this.cooks = []
      );

      this.kmws.getCategories()
       .subscribe(
         categories => {
             this.barChartLabels = categories.body.map(x => x.title);
             this.categories = categories.body;
          },
          err => this.barChartLabels = []
       );
  }

  ngOnInit() {
  }

  getData(valid: boolean): void{
    this.formError = false;
    if(!valid){
      return;
    }

    if(this.fromDate > this.toDate){
      this.formError = true;
    }

    this.kmws.getMyCookedDishesByDate(this.fromDate, this.toDate)
      .subscribe(
        data => {
          this.sumDishCooked = 0;
          this.sumProductCost = 0;

          if(this.selectedCook === 0){
            this.sumDishCooked = (data.body as Array<any>).length;
          }else{
            this.sumDishCooked = (data.body as Array<any>)
              .filter(dish => dish.userId === this.selectedCook)
              .length;
          }

          this.setChartData(data.body as Array<any>);

          if(this.selectedCook === 0){
            (data.body as Array<any>)
            .forEach(dish => {
              this.sumProductCost = parseFloat(dish.cost.toFixed(2)) + parseFloat(this.sumProductCost.toFixed(2));
              console.log(this.sumProductCost, dish.cost);
            });  
          }else{
            (data.body as Array<any>)
              .filter(dish => dish.userId === this.selectedCook)
              .forEach(dish => this.sumProductCost += dish.cost);
          }
        },
        err => {
          this.sumDishCooked = 0;
          this.sumProductCost = 0;
        });
  }

  setChartData(dishes: Array<any>){
    if(!dishes){
      return;
    }

    this.barChartData[0].data = [];
    this.categories.forEach(category => {
      this.barChartData[0].data.push(dishes.filter(dish => dish.categoryId === category.id).length);    
    });
  }
}
