import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { Dish } from '../custom_models/dish';
import { MyDish } from '../custom_models/my-dish';

@Component({
  selector: 'app-my-dishes',
  templateUrl: './my-dishes.component.html',
  styleUrls: ['./my-dishes.component.css']
})
export class MyDishesComponent implements OnInit {
  myDishes: Array<MyDish> = [];
  allDishes: Array<MyDish> = [];
  cooks = [];
  selectedCook = '';
  cardPressed = -1;
  currentDish: Dish = new Dish(0, '', [], 0, [], 0, '', 0);

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.loadMyDishes();
    this.loadCooks();
  }

  private loadMyDishes(){
    this.kmws.getMyToDoDish()
      .subscribe(
        data => {
          if(data.status != 200){
            this.myDishes = [];
            this.allDishes = [];
          }else{
            let resArray = data.body as Array<MyDish>;
            this.myDishes = [];
            this.allDishes = [];
            resArray.forEach(myDish => this.allDishes.push(myDish));
            this.allDishes.sort((a, b) => {
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
          this.loadCooks();
          if(this.cooks.length === 1){
            this.myDishes = this.allDishes;
          }else{
            this.selectedCook = this.cooks[0];
          }
        },
        error => {
          this.myDishes = [];
          this.allDishes = [];
        }
      );
  }

  loadCooks(){
    this.cooks = [...new Set(this.allDishes.map(x => x.userFullName))];
    this.cooks.unshift(`בחר טבח`);
  }

  loadDishesByCook(){
    this.myDishes = this.allDishes.filter(x => x.userFullName === this.selectedCook);
    if(this.cooks[0] === `בחר טבח`){
      this.cooks.shift();
    }
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
          console.log(this.currentDish);
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
