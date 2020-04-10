import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { Dish } from '../dish';
import { MyDish } from '../my-dish';

@Component({
  selector: 'app-my-dishes',
  templateUrl: './my-dishes.component.html',
  styleUrls: ['./my-dishes.component.css']
})
export class MyDishesComponent implements OnInit {
  myDishes: Array<MyDish> = [];
  cardPressed = -1;
  currentDish: Dish = new Dish(0, '', [], 0, [], 0, '', 0);

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.loadMyDishes();
  }

  private loadMyDishes(){
    this.kmws.getMyToDoDish()
      .subscribe(
        data => {
          if(data.status != 200){
            this.myDishes = [];
          }else{
            let resArray = data.body as Array<MyDish>;
            this.myDishes = [];
            resArray.forEach(myDish => this.myDishes.push(myDish));
            this.myDishes.sort((a, b) => {
              if(a.cookedDate === null && b.cookedDate === null){
                return (a.established > b.established) ? -1 : 1;
              }else if(a.cookedDate === null){
                return -1;
              }else if(b.cookedDate === null){
                return 1;
              }else{
                a.cookedDate > b.cookedDate ? -1 : 1;
              }
            });
          }
        },
        error => this.myDishes = []
      );
  }

  private isEmpty(){
    return (this.myDishes.length === 0) ? true : false;
  }

  onCardPressed(cardId: number){
    if(this.cardPressed === cardId){
      this.cardPressed = -1;
    }
    else{
      this.cardPressed = cardId;
      this.loadDish(this.myDishes.filter(x => x.id === cardId)[0].dishId);
    }
  }

  loadDish(dishId: number) {
    this.kmws.getDishById(dishId)
      .subscribe(
        data => {
          if(data.status != 200){
            this.currentDish = new Dish(0, '', [], 0, [], 0, '', 0);
          }else{
            this.currentDish.categoryId = data.body['categoryId'];
            this.currentDish.duration = data.body['duration'];
            this.currentDish.id = this.cardPressed;
            this.currentDish.imageUrl = data.body['imageUrl'];
            this.currentDish.ingerdients = [];
            data.body['ingerdients'].forEach(ing => this.currentDish.ingerdients.push(ing));
            this.currentDish.numberOfDines = data.body['numberOfDines'];
            this.currentDish.preperationSteps = [];
            data.body['preperationSteps'].forEach(s => this.currentDish.preperationSteps.push(s));
            this.currentDish.title = data.body['title'];
          }
        },
        error => this.currentDish = new Dish(0, '', [], 0, [], 0, '', 0)
      );
  }

  getHeaderButtonText(id){
    if(this.cardPressed === id){
      return 'לסגירה';
    }
    return 'לפרטים';
  } 

  refreshList(){
    this.cardPressed = -1;
    this.loadMyDishes();
  }
}
