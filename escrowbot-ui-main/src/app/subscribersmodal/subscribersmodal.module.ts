import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscribersModalComponent } from './subscribersmodal.component';

const routes: Routes = [
  
];

@NgModule({
  declarations: [
    SubscribersModalComponent,
                
            ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class SubscribersModalModule {}
