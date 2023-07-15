import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateorderComponent } from './UI/createorder/createorder.component';
import { HomeComponent } from './UI/home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from './services/order.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StripePaymentComponent } from './UI/stripe-payment/stripe-payment.component';
import { OrderslistComponent } from './UI/orderslist/orderslist.component';
import { UserprofileComponent } from './UI/userprofile/userprofile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './UI/login/login.component';
import { RegisterComponent } from './UI/register/register.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.inteceptor';
import { MerchantprofileComponent } from './UI/merchantprofile/merchantprofile.component';
import { FooterComponent } from './UI/footer/footer.component';
import { MerchantorderlistComponent } from './UI/merchantorderlist/merchantorderlist.component';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { GlowdropdownComponent } from './UI/glowdropdown/glowdropdown.component';
import { VendorpaymentpinComponent } from './UI/vendorpaymentpin/vendorpaymentpin.component';
import { ReportvendorComponent } from './UI/reportvendor/reportvendor.component';
import { BecomeVendorComponent } from './UI/become-vendor/become-vendor.component';
import { PaginationComponent } from './UI/pagination/pagination.component';
import { PaginationService } from './services/pagination.service';
import { AirtimeComponent } from './UI/airtime/airtime.component';
import { DataSubComponent } from './UI/datasub/datasub.component';
import { CableComponent } from './UI/cable/cable.component';
import {  CableElectricityService } from './services/cableelectricity.service';
import { GooglePayButtonComponent, GooglePayButtonModule } from '@google-pay/button-angular';
// import { CreateOrderModule } from './UI/createorder/createorder.module';

@NgModule({
  declarations: [
    AppComponent,
    CreateorderComponent,
    HomeComponent,
    StripePaymentComponent,
    OrderslistComponent,
    UserprofileComponent,
    LoginComponent,
    RegisterComponent,
    MerchantprofileComponent,
    FooterComponent,
    MerchantorderlistComponent,
    SpinnerComponent,
    GlowdropdownComponent,
    VendorpaymentpinComponent,
    ReportvendorComponent,
    BecomeVendorComponent,
    PaginationComponent,
    AirtimeComponent,
    DataSubComponent,
    CableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    AppRoutingModule,
    GooglePayButtonModule
  ],
  providers: [OrderService,AuthService,PaginationService,CableElectricityService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
],
  bootstrap: [AppComponent]
})
export class AppModule { }

