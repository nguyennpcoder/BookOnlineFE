import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailEbookComponent } from './components/detail-product/detail-ebook.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { OrderUserComponent } from './components/order-user/order.user.component';
import { DetailOrderUserComponent } from './components/detail-order-user/detail.order.user.component';
import { LoveComponent } from './components/love/love.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailureComponent } from './components/payment-failure/payment-failure.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';

//import { OrderAdminComponent } from './components/admin/order/order.admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'ebooks/:id', component: DetailEbookComponent },  
  { path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn] },
  { path: 'loves', component: LoveComponent,canActivate:[AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  { path: 'order-user', component: OrderUserComponent, canActivate:[AuthGuardFn] },
  // { path: 'order-user', component: OrderAdminComponent, canActivate:[AuthGuardFn] },

  { path: 'order-user-detail', component: DetailOrderUserComponent, canActivate:[AuthGuardFn] },
  // { path: 'order-detail-user', component: DetailOrderAdminComponent, canActivate:[AuthGuardFn] },
  // { path: 'order-user', component: OrderUserComponent, canActivate:[AuthGuardFn] },
  { path: 'orders/order-user/:id', component: DetailOrderUserComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment-failure', component: PaymentFailureComponent },
  { path: 'payment-form', component: PaymentFormComponent },

  
  //Admin   
  { 
    path: 'admin', 
    component: AdminComponent,  
    canActivate:[AdminGuardFn] 
  },      
];
