import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirtimeComponent } from './airtime/airtime.component';
import { DataComponent } from './data/data.component';
import { CableComponent } from './cable/cable.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { PaystackComponent } from './paystack/paystack.component';
import { ResolvePendingComponent } from './resolve-pending/resolve-pending.component';
import { Notfound404Component } from './notfound404/notfound404.component';
import { AdminComponent } from './admin/admin.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { EkoModalComponent } from './eko-modal/eko-modal.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { AdminDocumentationComponent } from './admindocumentation/admindocumentation.component';
import { CustomersComponent } from './customers/customers.component';



const routes: Routes = [
  { path:'',component: LandingpageComponent },
  { path:'admin/pricelist',component: AdminComponent },
  // { path:'autosubscription',component:EkoModalComponent},
  { path:'signup',component: RegisterComponent },
  { path:'signin',component: LoginComponent },
  { path:'dashboard',component: DashboardComponent },
  { path:'airtime',component: AirtimeComponent },
  { path:'data',component: DataComponent },
  { path:'cable',component: CableComponent },
  { path:'electricity',component: ElectricityComponent },
  { path:'cart',component: PaystackComponent },
  { path:'resolve/:path/pending/:id',component: ResolvePendingComponent },
  { path:'documentation',component: DocumentationComponent },
  { path:'admindocumentation',component: AdminDocumentationComponent },
  { path:'customers',component: CustomersComponent },
  
  // { path: '**', pathMatch: 'full', component: Notfound404Component },
  {
    path: '',
    component: EkoModalComponent,
  },
  {
    path: 'autosubscription/v1',
    loadChildren: () =>
      import('./eko-modal/eko-modal.module').then((m) => m.EkoModalModule),
      
  },
  

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
