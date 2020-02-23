import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, mapTo, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    private readonly URL = 'http://localhost:3000/auth';
    private loggedUser: string;

    constructor(private http: HttpClient) {}

    login(user: { username: string, password: string }): Observable<boolean>{
        return this.http.post<any>(`${this.URL}/login`, user)
            .pipe(
                tap(tokens => this.doLoginUser(user.username, tokens)),
                mapTo(true),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })
            )
    }

    register(user: { username: string, firstName: string, lastName: string, password: string, password2: string }): Observable<boolean>{
        return this.http.post<any>(`${this.URL}/register`, user)
            .pipe(
                tap(tokens => this.doLoginUser(user.username, tokens)),
                mapTo(true),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })
            )
    }

    logout(){
        return this.http.post<any>(`${this.URL}/logout`, {'refreshToken': this.getRefreshToken()})
            .pipe(
                tap(() => this.doLogoutUser()),
                mapTo(true),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })   
            )
    }

    isLoggedIn(){
        return !!this.getJwtToken()
    }

    refreshToken(){
        return this.http.post<any>(`${this.URL}/refresh`, {'refreshToken': this.getRefreshToken()})
            .pipe(tap((tokens: { jwt: string, refreshToken: string }) => this.storeJwtToken(tokens.jwt)));
    }

    getJwtToken(){
        return localStorage.getItem(this.JWT_TOKEN);
    }

    getRefreshToken(){
        return localStorage.getItem(this.REFRESH_TOKEN);
    }

    private doLoginUser(username: string, tokens: { jwt: string, refreshToken: string }){
        this.loggedUser = username;
        this.storeTokens(tokens);
    }

    private doLogoutUser(){
        this.loggedUser = null;
        this.removeTokens();
    }

    private storeTokens(tokens: { jwt: string, refreshToken: string }){
        localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
        localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
    }

    private storeJwtToken(jwt: string){
        localStorage.setItem(this.JWT_TOKEN, jwt);
    }

    private removeTokens(){
        localStorage.removeItem(this.JWT_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN);
    }
} 