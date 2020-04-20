import { Component, OnInit, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { Dish } from '../../custom_models/dish';
import { KmwsService } from '../../kmws.service';

@Component({
  selector: 'app-select-dish',
  templateUrl: './select-dish.component.html',
  styleUrls: ['./select-dish.component.css']
})
export class SelectDishComponent implements OnInit, OnChanges {
  private selectedDish: number = 0;
  private dishes: Array<Dish>;
  private categories: Array<any>;

  @Input()
  userUpdated: boolean = false;

  @Output()
  DishSelected = new EventEmitter<Dish>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.getAllCategories();
    this.getAllDishes();
  }

  getAllCategories(){
    this.kmws.getCategories()
      .subscribe(
        data => {
          if(data.status != 200){
            error => this.categories = [];
          }else{
            this.categories = (data.body as Array<any>).sort((a, b) => a.id - b.id);
          }
        },
        error => this.categories = []
      );
  }

  getAllDishes(){
    this.kmws.getAllDishes()
      .subscribe(
        data => {
          if(data.status != 200){
            error => this.dishes = [];
          }else{
            this.dishes = (data.body as Array<Dish>).sort((a, b) => a.categoryId - b.categoryId);
          }
        },
        error => this.dishes = [],
        () => this.dishes.unshift(new Dish(0, 'מנה חדשה', [], 0, [], 0, '',0))
      );
  }

  getName(id){
    const dish: Dish = this.dishes.filter(d => d.id === id)[0];
    if(dish.id === 0){
      return dish.title;
    }
    if(!this.categories){
      return '';
    }
   
    return `${this.categories.filter(c => c.id === dish.categoryId)[0].title} - ${dish.title}`;
  }

  onSelectDish(){
    this.DishSelected.emit(this.dishes.filter(d => d.id === this.selectedDish)[0]);
  }

  ngOnChanges(){
    this.getAllDishes();
    this.selectedDish = 0;
  }

  getISelected(dishId){
    if(dishId === this.selectedDish){
      return true;
    }
    return false;
  }
}
