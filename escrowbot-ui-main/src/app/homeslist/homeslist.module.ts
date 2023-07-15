import { ZoneslistComponent } from './../zoneslist/zoneslist.component';
import { EffectsModule } from '@ngrx/effects';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { HomeslistComponent } from './homeslist.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material.module';
import { MatGridListModule } from '@angular/material/grid-list';

const routes: Routes = [
  {
    path: 'home',
    children: [//http://localhost:4200/smarthome/v1/home/zones-list
      { path: 'zones-list', component: ZoneslistComponent },
      ],
  },
    
    
];

@NgModule({
  declarations: [ ZoneslistComponent ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MaterialModule, 
    MatGridListModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})

export class HomesListModule {}