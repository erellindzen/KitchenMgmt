import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './home/header/header.component';
import { LoginComponent } from './welcome/guest/login/login.component';
import { FooterComponent } from './home/footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { FormsModule } from '@angular/forms';
import { GuestComponent } from './welcome/guest/guest.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { SignUpComponent } from './welcome/guest/sign-up/sign-up.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { StockComponent } from './stock/stock.component';
import { IngredientFormComponent } from './stock/ingredient-form/ingredient-form.component';
import { ShippingFormComponent } from './stock/shipping-form/shipping-form.component';
import { DishFormComponent } from './dish-form/dish-form.component';
import { DishesComponent } from './dishes/dishes.component';
import { DishUserFormComponent } from './dishes/dish-user-form/dish-user-form.component';
import { MyDishesComponent } from './my-dishes/my-dishes.component';
import { DishComponent } from './my-dishes/dish/dish.component';
import { SelectDishComponent } from './dish-form/select-dish/select-dish.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart.component';
import { StockListComponent } from './stock/stock-list/stock-list.component';
import { NotificationComponent } from './dishes/notification/notification.component';
import { FileUploadComponent } from './dish-form/file-upload/file-upload.component';

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
    BarChartComponent,
    StockListComponent,
    NotificationComponent,
    FileUploadComponent
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
