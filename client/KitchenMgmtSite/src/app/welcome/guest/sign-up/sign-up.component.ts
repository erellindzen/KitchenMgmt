import { Component, OnInit } from '@angular/core';
import { SignupUser } from '../../../custom_models/signup-user';
import { AuthService } from '../../../auth/services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private title: string = "הרשמה למערכת";
  private user = new SignupUser('', '', '', '', '');
  private isError: boolean = false;
  private errorMessage: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
  }

  sendForm(valid){
    if(this.checkValidation())
      this.auth.register(this.user)
        .subscribe(isLoggedIn => {
          if(isLoggedIn){
            this.router.navigateByUrl('/main-menu');
          }else{
            this.errorMessage = "שם המשתמש קיים!";
            this.isError = true;
          }
        });
  }

  private checkValidation(): boolean{
    if(this.user.password.length < 6){
      this.errorMessage = "אורך הסיסמא חייבת להיות בת 6 תווים לפחות";
      this.isError = true;
      return false;
    }

    if(this.user.password != this.user.password2){
      this.errorMessage = "הסיסמאות אינן זהות!";
      this.isError = true;
      return false;
    }

    return true;
  }

}
