import { DashboardComponent } from './dashboard.component';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlotlyModule } from 'angular-plotly.js';
// import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material.module';
import * as PlotlyJS from 'plotly.js-dist-min';


PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    PlotlyModule,
    NgbModule,
  ]
})
export class DashboardModule { }
