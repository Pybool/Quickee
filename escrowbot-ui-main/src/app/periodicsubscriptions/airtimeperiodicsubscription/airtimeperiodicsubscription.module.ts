import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup ,FormArray, AbstractControl} from '@angular/forms';
// import { AirtimeperiodicsubscriptionComponent } from './airtimeperiodicsubscription.component';
import { TogglebuttonComponent } from 'src/app/togglebutton/togglebutton.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MaterialModule } from 'src/app/material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
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
  ]
})
export class AirtimeperiodicsubscriptionModule { }