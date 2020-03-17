import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { FormsModule } from '@angular/forms';
import { GuestComponent } from './guest/guest.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { StockComponent } from './stock/stock.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { ShippingFormComponent } from './shipping-form/shipping-form.component';
import { DishFormComponent } from './dish-form/dish-form.component';
import { DishesComponent } from './dishes/dishes.component';
import { DishUserFormComponent } from './dish-user-form/dish-user-form.component';
import { MyDishesComponent } from './my-dishes/my-dishes.component';
import { DishComponent } from './dish/dish.component';
import { SelectDishComponent } from './select-dish/select-dish.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    WelcomeComponent,
    GuestComponent,
    SignUpComponent,
    MainMenuComponent,
    StockComponent,
    IngredientFormComponent,
    ShippingFormComponent,
    DishFormComponent,
    DishesComponent,
    DishUserFormComponent,
    MyDishesComponent,
    DishComponent,
    SelectDishComponent,
    DashboardComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
