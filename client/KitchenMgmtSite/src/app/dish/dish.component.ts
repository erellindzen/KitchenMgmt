import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dish } from '../custom_models/dish';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {

  private finishCookError = false;

  @Input()
  dish: Dish;

  @Input()
  isCooked: boolean;

  @Input()
  cookedRequested: Date;

  @Output()
  dishServed = new EventEmitter<number>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
  }

  finishCook(){
    this.kmws.updateDishReady(this.dish.id)
      .subscribe(
        data => {
          if(data.status != 200){
            this.finishCookError = true
          }
          else{
            this.finishCookError = false;
            this.dishServed.emit(this.dish.id);
          }
        },
        error => this.finishCookError = true
      );
  }

}
