import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { KmwsService } from '../kmws.service';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {

  @Input()
  ingredientId: number;

  @Input()
  ingredientCanExpired: boolean;

  private shipping = {
    ingredientId: -1,
    quantity: undefined,
    expirationDate: undefined
  };

  private isErrorOnResponse = false;

  @Output()
  shippingAdded = new EventEmitter<string>();

  constructor(private kmws: KmwsService) { }

  ngOnInit() {
  }

  sendForm(isValid){
    if(isValid){
      if(this.shipping.quantity > 0){
        this.shipping.ingredientId = this.ingredientId;
        this.kmws.createShipping(this.shipping)
        .subscribe(
          data => {
            if(data.status != 200){
              this.isErrorOnResponse = true;
            }
            else{
              this.isErrorOnResponse = false;
              this.shippingAdded.emit("success");
            }
          },
          err => this.isErrorOnResponse = true
        );
      }
    }
  }
}
