import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dish } from '../dish';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {

  @Input()
  dish: Dish;

  @Output()
  dishServed = new EventEmitter<number>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
  }

  finishCook(){
    this.kmws.updateDishReady(this.dish.id)
      .subscribe(
        data => this.dishServed.emit(this.dish.id),
        error => this.dishServed.emit(this.dish.id)
      );
  }

}
