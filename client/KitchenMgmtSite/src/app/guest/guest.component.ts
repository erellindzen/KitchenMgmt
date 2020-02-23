import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  isLogin = false;
  isSignUp = false;

  constructor() { }

  ngOnInit() {
  }

  toLogin(){
    this.isSignUp = false;
    this.isLogin = !this.isLogin;
  }

  toSignUp(){
    this.isLogin = false;
    this.isSignUp = !this.isSignUp;
  }

}
