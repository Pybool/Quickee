import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosubplansComponent } from './autosubplans.component';

const routes: Routes = [
  
];

@NgModule({
  declarations: [
    AutosubplansComponent,
                
            ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    RouterModule.forChild(routes),
  ],
})
export class AutosubplansModalModule {}
