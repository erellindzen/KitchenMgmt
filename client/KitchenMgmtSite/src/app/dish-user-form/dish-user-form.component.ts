import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-dish-user-form',
  templateUrl: './dish-user-form.component.html',
  styleUrls: ['./dish-user-form.component.css']
})
export class DishUserFormComponent implements OnInit {
  private cooks = [];
  private selectedCook = -1;
  private isError = false;
  private ingredientMissing = false;

  @Input()
  dishId: number;

  @Output()
  onAssociate = new EventEmitter<boolean>();

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
          if(data.status === 204){
            this.ingredientMissing = true;
          }else{
            this.onAssociate.emit(true);
          }
        },
        error => this.isError = true
      );
  }
}
