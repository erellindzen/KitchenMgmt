import { Component, OnInit } from '@angular/core';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  private ingredients = [];
  private elementShippings = [];
  private cardPressed = '';
  private addIngredientPressed = false;
  private addShippingPressed = false;
  private shippingsId = '';

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
    this.loadIngredients();
  }

  isEmpty(){
    return this.ingredients.length === 0;
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

  private loadIngredients(){
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
                price: x.price,
                canExpired: x.canExpired,
                domCardId: `card_${x.id}_id`,
                domCollapseId: `collapse_${x.id}_id`,
                domShippingId: `shipping_${x.id}_id`
              };
              return newIngredient;
            });
          }
        },
        err => this.ingredients = []
      );
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

  private refreshList(){
    this.addShippingPressed = false;
    this.addIngredientPressed = false;
    this.loadIngredients();
  }

  private refreshShippingList(cardId){
    this.addShippingPressed = false;
    this.loadShippings(cardId);
  }

  private getHeaderButtonText(cardId){
    if(this.cardPressed === cardId){
      return 'לסגירה';
    }
    return 'לפרטים';
  }
}
