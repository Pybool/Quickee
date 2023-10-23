// // order.module.ts

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { StripePaymentModule } from '../stripe-payment/stripe-payment.module';
// import { CreateorderComponent } from './createorder.component';
// import { RouterModule, Routes } from '@angular/router';
// import { StripePaymentComponent } from '../stripe-payment/stripe-payment.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// const routes:Routes = [{
//     path:'',
//     component:CreateorderComponent,
//     children:[
//         {path:'stripe-payment',component:StripePaymentComponent}
//     ]
// }]
// @NgModule({
//   declarations: [CreateorderComponent],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     StripePaymentModule,
//     RouterModule.forChild(routes)
//   ]
// })

// export class CreateOrderModule{ }