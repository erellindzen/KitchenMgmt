import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { NgForm } from '@angular/forms';
import { Dish } from '../dish';


@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {

  private dish = {
    title: 'מנה חדשה',
    preperationSteps: [],
    duration: '',
    ingredients: [],
    numberOfDines: '',
    imageUrl: '',
    categoryId: ''
  };
  private newStep: string = undefined;
  private ingredients = [];
  private categories = [];
  public selectedNewIngredient = {id: 0, title: 'בחר...', unitTitle: 'כמות', quantity: undefined};
  private isErrorOnResponse = false;
  private sumPrice = `0 ש"ח`;
  private selectedId = 0;
  private isUserUpdated = false;

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.getIngredients();
    this.getCategories();
  }

  private addStep(){
    if(this.newStep && this.newStep.length >= 3){
      this.dish.preperationSteps.push(this.newStep);
      this.newStep = '';
    }
  }

  getIngredients() {
    this.kmws.getIngredients()
      .subscribe(
        data => {
          if(data.status != 200){
            this.ingredients = [];
          }
          else{
            this.ingredients = data.body.sort().map(x => {
              let newIngredient = {
                id: x.id,
                title: x.title,
                unitTitle: x.unitTitle,
                price: x.price
              };
              return newIngredient;
            });
          }
        },
        err => this.ingredients = []
      );
  }

  getCategories() {
    this.kmws.getCategories()
      .subscribe(
        data => {
          if(data.status != 200){
            this.categories = [];
          }
          else{
            this.categories = data.body.sort().map(x => {
              let newCategory = {
                id: x.id,
                title: x.title
              };
              return newCategory;
            });
          }
        },
        err => this.categories = []
      );
  }

  getIngredientsDetails(ingredientId){
    let ingredientFromServer = this.ingredients.filter(ing => ing.id === ingredientId)[0];
    let ingredientFromUser = this.dish.ingredients.filter(ing => ing.id === ingredientId)[0];

    return `${ingredientFromServer.title} - ${ingredientFromUser.quantity} ${ingredientFromServer.unitTitle}`;
  }

  addIngredient(){
    if(this.selectedNewIngredient.quantity >0 ){
      let newIngredientForServer = {
        id: this.selectedNewIngredient.id,
        quantity: this.selectedNewIngredient.quantity
      }
      this.dish.ingredients.push(newIngredientForServer);
      this.selectedNewIngredient = {id: 0, title: 'בחר...', unitTitle: 'כמות', 'quantity': undefined};
      
      this.calculateSumPrice();
    }
  }

  sendForm(isValid){
    if(isValid){
      if(this.selectedId === 0){
        if(this.dish.ingredients.length > 0 && parseInt(this.dish.categoryId) > 0 && this.dish.preperationSteps.length > 0){
          this.kmws.createDish(this.dish)
          .subscribe(
            data => {
              if(data.status != 200){
                this.isErrorOnResponse = true;
              }else{
                this.isUserUpdated = !this.isUserUpdated;
                this.clearForm();
              }
            },
            err => this.isErrorOnResponse = true
          );
        }
      }else{
        const updateDish = new Dish(this.selectedId,
                                    this.dish.title,
                                    this.dish.preperationSteps,
                                    parseInt(this.dish.duration),
                                    this.dish.ingredients,
                                    parseInt(this.dish.numberOfDines),
                                    this.dish.imageUrl,
                                    parseInt(this.dish.categoryId));
        this.kmws.updateDish(updateDish)
        .subscribe(
          data => {
            if(data.status != 200){
              this.isErrorOnResponse = true;
            }else{
              this.isUserUpdated = !this.isUserUpdated;
              this.clearForm();
            }
          },
          err => this.isErrorOnResponse = true
        );
      }
    }
  }

  calculateSumPrice(){
    const newPrice = this.dish.ingredients.reduce(
      (total, item) => total + (item.quantity * parseInt(this.ingredients.filter(i => i.id === item.id)[0].price)), 0);
    this.sumPrice = `${newPrice.toFixed(2)} ש"ח`;
  }

  removeIngredient(id, index){
    this.dish.ingredients.splice(index, 1);
    this.calculateSumPrice();
  }

  removeStep(index){
    this.dish.preperationSteps.splice(index, 1);
  }

  setSelectedDish(dish: Dish){
    this.selectedId = dish.id;
    this.dish.categoryId = (dish.categoryId === 0) ? '' : dish.categoryId.toString();
    this.dish.duration = (dish.duration === 0) ? '' : dish.duration.toString();
    this.dish.imageUrl = dish.imageUrl;
    this.dish.ingredients = dish.ingerdients;
    this.dish.numberOfDines = (dish.numberOfDines === 0) ? '' : dish.numberOfDines.toString();
    this.dish.preperationSteps = dish.preperationSteps;
    this.dish.title = dish.title;
    this.calculateSumPrice();
  }

  clearForm(){
    this.dish = {
      title: 'מנה חדשה',
      preperationSteps: [],
      duration: '',
      ingredients: [],
      numberOfDines: '',
      imageUrl: '',
      categoryId: ''
    };

    this.isErrorOnResponse = false;
    this.calculateSumPrice();
  }
}
