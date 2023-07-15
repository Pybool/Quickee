import { CustomersComponent } from './../periodicsubscriptions/customers/customers.component';
import { ElectricityperiodicsubscriptionComponent } from './../periodicsubscriptions/electricityperiodicsubscription/electricityperiodicsubscription.component';
import { CableperiodicsubscriptionComponent } from './../periodicsubscriptions/cableperiodicsubscription/cableperiodicsubscription.component';
import { DataperiodicsubscriptionComponent } from './../periodicsubscriptions/dataperiodicsubscription/dataperiodicsubscription.component';
import { AirtimeperiodicsubscriptionModule } from './../periodicsubscriptions/airtimeperiodicsubscription/airtimeperiodicsubscription.module';
import { AirtimeperiodicsubscriptionComponent } from './../periodicsubscriptions/airtimeperiodicsubscription/airtimeperiodicsubscription.component';
import { UtilityService } from 'src/app/services/utility.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { NgModule,Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
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
      path: '',
      children: [
          { path: 'customers', component: CustomersComponent },
          { path: 'airtime', component: AirtimeperiodicsubscriptionComponent },
          { path: 'data', component: DataperiodicsubscriptionComponent },
          { path: 'cable', component: CableperiodicsubscriptionComponent },
          { path: 'electricity', component: ElectricityperiodicsubscriptionComponent },
        ],
    },
    
  {
    path: '',
    loadChildren: () =>
      import('../periodicsubscriptions/airtimeperiodicsubscription/airtimeperiodicsubscription.module').then((m) => m.AirtimeperiodicsubscriptionModule),
      
  },
    
  ];
  

@NgModule({
    declarations: [ AirtimeperiodicsubscriptionComponent,
                    DataperiodicsubscriptionComponent,
                    CableperiodicsubscriptionComponent,
                    ElectricityperiodicsubscriptionComponent,
                    CustomersComponent
                ],
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

  
export class EkoModalModule {
  constructor(){    // Create global Service Injector.
   
  }
 }