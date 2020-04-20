import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';
import { Ingredient } from '../custom_models/ingredient';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  private ingredients = [[], [], []];
  private ingredientsSearched = [[], [], []];
  private addIngredientPressed = false;
  private addShippingPressed = false;
  private listTitles = ['מלאי תקין', 'מלאי מועט', 'מלאי ריק'];

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.loadIngredients();
  }

  isEmpty(){
    return this.ingredients[0].length === 0 && this.ingredients[1].length === 0 && this.ingredients[2].length === 0;
  }

  private loadIngredients(){
    this.kmws.getIngredientsStatus()
      .subscribe(
        data => {
          if(data.status != 200){
            this.ingredients = [[], [], []];
            this.ingredientsSearched = [[], [], []];
          }
          else{
            this.setIngredients(data.body, 0, 2);
            this.setIngredients(data.body, 1, 1);
            this.setIngredients(data.body, 2, 0);
            this.onSearchChange('');
          }
        },
        err => {
          this.ingredients = [[], [], []];
          this.ingredientsSearched = [[], [], []];
        }
      );
  }

  private refreshList(){
    this.addShippingPressed = false;
    this.addIngredientPressed = false;
    this.loadIngredients();
  }

  private setIngredients(data: any, ingredientsListNumber: number, status: number){
    this.ingredients[ingredientsListNumber] = data
      .sort((a, b) => a.ingredient.title < b.ingredient.title ? -1 : 1)
      .filter(x => x.status === status)
      .map(x => {
        let newIngredient = {
          id: x.ingredient.id,
          title: x.ingredient.title,
          unitTitle: x.unitTitle, 
          price: x.ingredient.price,
          canExpired: x.ingredient.canExpired,
          domCardId: `card_${x.ingredient.id}_id`,
          domCollapseId: `collapse_${x.ingredient.id}_id`,
          domShippingId: `shipping_${x.ingredient.id}_id`
        };
        return newIngredient;
    });
  }

  onSearchChange(searchPhrase: string){
    for(let i = 0; i < this.ingredients.length; i++){
      this.ingredientsSearched[i] = this.ingredients[i].filter(ing => ing.title.search(searchPhrase) > -1);
    }
  }
}
