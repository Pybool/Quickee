import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateorderComponent } from './UI/createorder/createorder.component';
import { HomeComponent } from './UI/home/home.component';
import { StripePaymentComponent } from './UI/stripe-payment/stripe-payment.component';
import { OrderslistComponent } from './UI/orderslist/orderslist.component';
import { UserprofileComponent } from './UI/userprofile/userprofile.component';
import { LoginComponent } from './UI/login/login.component';
import { RegisterComponent } from './UI/register/register.component';
import { MerchantprofileComponent } from './UI/merchantprofile/merchantprofile.component';
import { MerchantorderlistComponent } from './UI/merchantorderlist/merchantorderlist.component';
import { VendorpaymentpinComponent } from './UI/vendorpaymentpin/vendorpaymentpin.component';
import { BecomeVendorComponent } from './UI/become-vendor/become-vendor.component';
import { AirtimeComponent } from './UI/airtime/airtime.component';
import { DataSubComponent } from './UI/datasub/datasub.component';
import { CableComponent } from './UI/cable/cable.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'new-order', component: CreateorderComponent},
  {path: 'orders', component: OrderslistComponent},
  {path: 'stripepayments', component: StripePaymentComponent},
  {path: 'userprofile', component: UserprofileComponent},
  {path: 'merchantprofile', component: MerchantprofileComponent},
  {path: 'merchant-orders', component: MerchantorderlistComponent},
  {path: 'vendor-subscription', component: BecomeVendorComponent},
  {path: 'airtime', component: AirtimeComponent},
  {path: 'data', component: DataSubComponent},
  {path: 'cable', component: CableComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
