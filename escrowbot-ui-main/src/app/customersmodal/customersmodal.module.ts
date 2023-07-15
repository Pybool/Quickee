import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersModalComponent } from './customersmodal.component';

const routes: Routes = [
  
];

@NgModule({
  declarations: [
    CustomersModalComponent,
                
            ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class CustomersModalModule {}
