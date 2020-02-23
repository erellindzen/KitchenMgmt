import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { MainMenuGuard } from './auth/guards/main-menu.guard';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { StockComponent } from './stock/stock.component';
import { DishFormComponent } from './dish-form/dish-form.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DishesComponent } from './dishes/dishes.component';
import { MyDishesComponent } from './my-dishes/my-dishes.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: 'main-menu', component: MainMenuComponent, canActivate: [MainMenuGuard] },
  { path: 'stock', component: StockComponent, canActivate: [MainMenuGuard] },
  { path: 'dish-form', component: DishFormComponent, canActivate: [MainMenuGuard] },
  { path: 'dishes/:categoryId', component: DishesComponent, canActivate: [MainMenuGuard] },
  { path: 'my-dishes', component: MyDishesComponent, canActivate: [MainMenuGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [MainMenuGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
