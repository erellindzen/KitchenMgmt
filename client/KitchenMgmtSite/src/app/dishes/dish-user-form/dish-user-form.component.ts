import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { KmwsService } from '../../kmws.service';
import { IngredientAlert } from 'src/app/custom_models/ingredients-alert';

@Component({
  selector: 'app-dish-user-form',
  templateUrl: './dish-user-form.component.html',
  styleUrls: ['./dish-user-form.component.css']
})
export class DishUserFormComponent implements OnInit {
  private cooks = [];
  private selectedCook = -1;
  private isError = false;

  @Input()
  dishId: number;

  @Output()
  onAssociate = new EventEmitter<IngredientAlert>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
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
  }

  sendForm(valid: boolean){
    this.isError = false;   
    if(!valid){
      return;
    }

    this.kmws.associateDishToCook(this.dishId, this.selectedCook)
      .subscribe(
        data => {
          const ingAlert = new IngredientAlert((data.body as Array<any>).filter(ing => ing.status === 1).map(ing => ing.ingredient.title), 
                                               (data.body as Array<any>).filter(ing => ing.status === 0).map(ing => ing.ingredient.title));
          this.onAssociate.emit(ingAlert);
        },
        error => this.isError = true
      );
  }
}
