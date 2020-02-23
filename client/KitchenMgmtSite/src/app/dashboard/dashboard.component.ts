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
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [], label: 'קטגוריות ראשיות' }
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
          this.barChartLabels = categories.body.map(x => x.title),
          err => this.barChartLabels = []
      });
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

          console.log(data.body);
          if(this.selectedCook === 0){
            this.sumDishCooked = (data.body as Array<any>).length;
          }else{
            this.sumDishCooked = (data.body as Array<any>)
              .filter(dish => dish.userId === this.selectedCook)
              .length;
          }

          if(this.selectedCook === 0){
            (data.body as Array<any>)
            .forEach(dish => this.sumProductCost += dish.cost);  
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
}
