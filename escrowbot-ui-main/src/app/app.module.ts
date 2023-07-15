import { CustomersModalModule } from './customersmodal/customersmodal.module';
import { AutosubplansModalModule } from './autosubplans/autosubplans.module';
import { UtilityService } from 'src/app/services/utility.service';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { NgModule,Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaystackComponent } from './paystack/paystack.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AirtimeComponent } from './airtime/airtime.component';
import { DataComponent } from './data/data.component';
import { CableComponent } from './cable/cable.component';
import { EkoModalComponent } from './eko-modal/eko-modal.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import {ServiceLocator} from './locator.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import {MatIconModule} from '@angular/material/icon'
import { OverlayComponent } from './overlay/overlay.component';
import { ResolvePendingComponent } from './resolve-pending/resolve-pending.component';
import { StoreModule } from '@ngrx/store';
import { addPendingOrderReducer } from './reducers/resolve.reducer';
import { AlertComponent } from './alert/alert.component';
import { SucessTickComponent } from './sucess-tick/sucess-tick.component';
import { DatetimeComponent } from './datetime/datetime.component';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

import { CableperiodicsubscriptionModule } from './periodicsubscriptions/cableperiodicsubscription/cableperiodicsubscription.module';
// import { AirtimeperiodicsubscriptionModule } from './periodicsubscriptions/airtimeperiodicsubscription/airtimeperiodicsubscription.module';
import { DataperiodicsubscriptionModule } from './periodicsubscriptions/dataperiodicsubscription/dataperiodicsubscription.module';
import { ElectricityperiodicsubscriptionModule } from './periodicsubscriptions/electricityperiodicsubscription/electricityperiodicsubscription.module';
import { RoutesService } from './services/routes.service';
import { AdminComponent } from './admin/admin.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AdminDocumentationComponent } from './admindocumentation/admindocumentation.component';
import { SubscribersModalModule } from './subscribersmodal/subscribersmodal.module';
import { CustomersComponent } from './customers/customers.component';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    PaystackComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AirtimeComponent,
    DataComponent,
    CableComponent,
    EkoModalComponent,
    ElectricityComponent,
    DashboardComponent,
    OverlayComponent,
    ResolvePendingComponent,
    AlertComponent,
    SucessTickComponent,
    DatetimeComponent,
    AdminComponent,
    LandingpageComponent,
    DocumentationComponent,
    AdminDocumentationComponent,
    CustomersComponent
  ],
  imports: [
    
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatIconModule,
    PlotlyModule,
    NgbModule,
    AutosubplansModalModule,
    CustomersModalModule,
    SubscribersModalModule,

    StoreModule.forRoot({pendingOrders: addPendingOrderReducer})

  ],
  providers: [AirtimeComponent,AlertComponent,SubscriptionsService,
              NgbActiveModal,UtilityService,RoutesService,
             ], 
  bootstrap: [AppComponent]
})
// export class AppModule { }
export class AppModule {
  constructor(private injector: Injector){    // Create global Service Injector.
    ServiceLocator.injector = this.injector;
  }
 }