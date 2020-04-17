import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {
  
  private ingredient = {
    title: '',
    unitTitle: '',
    threshold: undefined,
    price: undefined,
    canExpired: false
  };

  private isErrorOnResponse = false;

  @Output()
  ingredientAdded = new EventEmitter<string>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
  }

  sendForm(isValid){
    if(isValid){
      if(this.ingredient.price > 0){
        this.kmws.createIngredient(this.ingredient)
        .subscribe(
          data => {
            if(data.status != 200){
              this.isErrorOnResponse = true;
            }
            else{
              this.isErrorOnResponse = false;
              this.ingredientAdded.emit("success");
            }
          },
          err => this.isErrorOnResponse = true
        );
      }
    }
  }
}
