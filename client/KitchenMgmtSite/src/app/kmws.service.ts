import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dish } from './custom_models/dish';

@Injectable({
  providedIn: 'root'
})
export class KmwsService {
  private readonly URL = 'http://localhost:3000';
  
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any>{
    return this.http.get(`${this.URL}/category`, {observe: 'response'});
  }

  getCategoryById(categoryId): Observable<any>{
    return this.http.get(`${this.URL}/category/${categoryId}`, {observe: 'response'});
  }

  getIngredientsStatus(): Observable<any>{
    return this.http.get(`${this.URL}/ingredient/`, {observe: 'response'})
  }

  getStockByIngredientId(ingredientId: number): Observable<any>{
    return this.http.get(`${this.URL}/stock/ingredient/${ingredientId}`, {observe: 'response'})
  }

  createIngredient(ingredient: object){
    return this.http.post(`${this.URL}/ingredient`, ingredient, {observe: 'response'});
  }

  createShipping(shipping: object){
    return this.http.post(`${this.URL}/stock`, shipping, {observe: 'response'});
  }

  getAllDishes(){
    return this.http.get(`${this.URL}/dish`, {observe: 'response'});
  }

  getDishByCategory(categoryId: number){
    return this.http.get(`${this.URL}/dish/category/${categoryId}`, {observe: 'response'});
  }

  createDish(dish: object){
    return this.http.post(`${this.URL}/dish`, dish, {observe: 'response'});
  }

  updateDish(dish: Dish){
    return this.http.put(`${this.URL}/dish`, dish, {observe: 'response'});
  }

  getDishById(dishId: number){
    return this.http.get(`${this.URL}/dish/${dishId}`, {observe: 'response'});
  }

  getCookNames(){
    return this.http.get(`${this.URL}/cook`, {observe: 'response'});
  }

  associateDishToCook(dishId, userId){
    return this.http.post(`${this.URL}/cookedDish`, { dishId: dishId, userId: userId},  {observe: 'response'});
  }

  getMyToDoDish(){
    return this.http.get(`${this.URL}/cookedDish/notReady`,  {observe: 'response'});
  }

  updateDishReady(dishId){
    return this.http.put(`${this.URL}/cookedDish`, {id: dishId}, {observe: 'response'});
  }

  getMyCookedDishesByDate(from: Date, to: Date){
    return this.http.get(`${this.URL}/cookedDish/from/${from}/to/${to}`,  {observe: 'response'});
  }

  getNavs(){
    return this.http.get(`${this.URL}/nav`,  {observe: 'response'});
  }
}
