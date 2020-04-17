import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { KmwsService } from '../kmws.service';
import { Category } from '../custom_models/category';
import { HttpResponse } from '@angular/common/http';
import { IngredientAlert } from '../custom_models/ingredients-alert';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  private sub: Subscription;
  private category: Category;
  private dishes = [];
  private imagePrefix = '../../assets/images/dishes/';
  private chosenDish = -1;
  private isNotificationOn = false;
  private currIngAlert: IngredientAlert;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private kmws: KmwsService,
    ) {
      this.category = new Category(0, '', '');
      this.currIngAlert = new IngredientAlert([], []);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
        this.kmws.getCategoryById(params['categoryId'])
          .subscribe(
            data => this.handleCategoryResponse(data),
            error => {
              this.category.title = "שגיאה בטעינת הדף";
              this.category.id = 0;
              this.category.image = '';
            });
    });
  }

  private handleCategoryResponse(category){
    if(category.status != 200){
        this.category.title = "שגיאה בטעינת הדף";
        this.category.id = 0;
        this.category.image = '';
    }
    else{
      this.category.id = category.body.id;
      this.category.title = category.body.title;
      this.category.image = category.body.image;

      this.kmws.getDishByCategory(this.category.id)
        .subscribe(
          data => this.handleDishesResponse(data),
          error => this.dishes = []
        );
    }
  }

  private handleDishesResponse(dishesRes): void {
    if(!dishesRes.body || dishesRes.status != 200){
      this.dishes = [];
    }
    else{
      dishesRes.body.forEach(dish => this.dishes.push(dish));
    }
  }

  private getDishImage(image: string): string{
    return `${this.imagePrefix}${this.category.title}/${image}.jpg`;
  }

  private onBackPressed(){
    this.router.navigateByUrl('/main-menu');
  }

  private onDishClick(id){
    this.chosenDish = (this.chosenDish === -1) ? id : ((this.chosenDish === id) ? -1 : id); 
  }

  onNotificationClose(){
    this.isNotificationOn = false;
    this.chosenDish = -1;
    this.currIngAlert.emptyAmount = [];
    this.currIngAlert.littleAmount = [];
  }

  onNotificationOpen(ingAlert: IngredientAlert){
    this.currIngAlert.littleAmount = ingAlert.littleAmount;
    this.currIngAlert.emptyAmount = ingAlert.emptyAmount;
    this.isNotificationOn = true;
  }
}
