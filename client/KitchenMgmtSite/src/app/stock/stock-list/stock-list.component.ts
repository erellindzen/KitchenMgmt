import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/custom_models/ingredient';
import { KmwsService } from 'src/app/kmws.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  
  private cardPressed = '';
  private elementShippings = [];
  private shippingsId = '';

  @Input()
  title: string;

  @Input()
  ingredients: Array<Ingredient>;

  @Input()
  addShippingPressed: boolean;

  @Output()
  onRefreshShippingList = new EventEmitter();

  constructor(private kmws: KmwsService)
   { }

  ngOnInit(): void {
  }

  private getHeaderButtonText(cardId){
    if(this.cardPressed === cardId){
      return 'לסגירה';
    }
    return 'לפרטים';
  }

  onCardPressed(cardId){
    this.addShippingPressed = false;
    this.elementShippings = [];
    if(this.cardPressed === cardId){
      this.cardPressed = '';
    }
    else{
      this.cardPressed = cardId;
    }
    
    this.loadShippings(cardId);
  }

  private loadShippings(cardId){
    this.kmws.getStockByIngredientId(cardId)
      .subscribe(
        data => {
          if(data.status != 200){
            this.elementShippings = [];
          }
          else{
            this.elementShippings = data.body.map(x => {
              let newShipping = {
                id: x.id,
                quantity: x.quantity,
                arrivalDate: new Date(x.arrivalDate).toLocaleDateString('he-IS'),
                expirationDate: new Date(x.expirationDate).toLocaleDateString('he-IS')
              };
              return newShipping;
            });
          }
        },
        err => this.elementShippings = []
      );
  }

  private refreshShippingList(cardId){
    this.addShippingPressed = false;
    this.loadShippings(cardId);
    this.onRefreshShippingList.emit();
  }

  private refreshList(){
    this.onRefreshShippingList.emit();
  }

  private onAddShippingPressed(ing: Ingredient){
    this.addShippingPressed=!this.addShippingPressed; 
    this.shippingsId = ing.domShippingId;
  }
}
