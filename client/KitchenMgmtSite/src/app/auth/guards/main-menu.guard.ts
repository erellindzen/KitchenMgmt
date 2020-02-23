import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MainMenuGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(){
        const isLoggedIn = this.authService.isLoggedIn();
        if(!isLoggedIn){
            this.router.navigate(['/welcome']);
        }
    
        return isLoggedIn;
    }
}