import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../../../custom_models/login-user';
import { AuthService } from '../../../auth/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private title: string = "כניסה למערכת";
  private user = new LoginUser('', '');
  private isError: boolean = false;
  private errorMessage: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
  }

  sendForm(valid){
    this.auth.login(this.user)
      .subscribe(
        isLoggedIn => {
          if(isLoggedIn){
            this.router.navigateByUrl('/main-menu');
            this.isError = false;
          }else{
            this.isError = true;
            this.errorMessage = "שם המשתמש או הסיסמא אינם נכוונים";
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = "היתה תקלה בעת ניסיון הכניסה";
        }
      );
  }
}
