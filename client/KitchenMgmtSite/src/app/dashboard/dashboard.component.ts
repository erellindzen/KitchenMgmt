import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  categoryChartLabels: Array<string> = [];
  categoryData: Array<number> = [];
  dishByCategory: any = [];
  private mainChartTitle = 'חלוקה לפי קטגוריות';

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
             this.categoryChartLabels = categories.body.map(x => x.title);
             this.categories = categories.body;
          },
          err => this.categoryChartLabels = []
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
          this.sumProductCost = 0

          if(this.selectedCook === 0){
            this.sumDishCooked = (data.body as Array<any>).length;
          }else{
            this.sumDishCooked = (data.body as Array<any>)
              .filter(dish => dish.userId === this.selectedCook)
              .length;
          }

          if(this.selectedCook === 0){
            this.setChartData(data.body as Array<any>);
          }else{
            this.setChartData((data.body as Array<any>).filter(dish => dish.userId === this.selectedCook));
          }

          if(this.selectedCook === 0){
            (data.body as Array<any>).forEach(dish => this.sumProductCost = (parseFloat(dish.cost.toFixed(2)) + parseFloat(this.sumProductCost.toFixed(2))));  
          }else{
            (data.body as Array<any>)
              .filter(dish => dish.userId === this.selectedCook)
              .forEach(dish => this.sumProductCost += dish.cost);
          }

          this.sumProductCost = parseFloat(this.sumProductCost.toFixed(2));
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

    this.categoryData= [];
    this.dishByCategory = [];
    this.categories.forEach(category => {
      this.categoryData.push(dishes.filter(dish => dish.categoryId === category.id).length);    
      
      let catDishes = dishes.filter(dish => dish.categoryId === category.id);
      let labels = [];
      let data = [];
      
      this.groupBy(catDishes, dish=>dish.dishTitle).forEach(catDish => {
        labels.push(catDish[0].dishTitle);
        data.push(catDish.length);
      });
      this.dishByCategory.push({labels: labels, data: data});
    });

  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
  }

  isShowChart(): boolean{
    if(this.dishByCategory.length > 0){
      return true;
    }
      
    return false;
  }
}
