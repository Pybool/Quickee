import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as ecmiData from './ecmi_data'

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  user:any = {can_approve:true}
  displayedcolumns: string[] = [];
  hiddenColumns: string[] = [];
  datasource!: MatTableDataSource<any>;
  ecmiCustomers: any;
  transients:string[] = [];
  defaults:string[] = []
  customersType:any
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>(ecmiData.data);

  columns = [
    { header: 'Account Number', field: 'accountno', matColumnDef: 'accountno' },
    { header: 'Meter Number', field: 'meterno', matColumnDef: 'meterno' },
    { header: 'Book Number', field: 'bookno', matColumnDef: 'bookno' },
    { header: 'Tariff ID', field: 'tariffid', matColumnDef: 'tariffid' },
    { header: 'Surname', field: 'surname', matColumnDef: 'surname' },
    { header: 'Other Names', field: 'othernames', matColumnDef: 'othernames' },
    { header: 'Address', field: 'address', matColumnDef: 'address' },
    { header: 'State', field: 'state', matColumnDef: 'state' },
    { header: 'Mobile', field: 'mobile', matColumnDef: 'mobile' },
    { header: 'Activated', field: 'activated', matColumnDef: 'activated' },
    { header: 'Status', field: 'status', matColumnDef: 'status' },
    { header: 'Account Type', field: 'accounttype', matColumnDef: 'accounttype' },
    { header: 'Tariff Code', field: 'tariffcode', matColumnDef: 'tariffcode' },
    { header: 'Service Center', field: 'servicecenter', matColumnDef: 'servicecenter' },
    { header: 'Updated At', field: 'updated_at', matColumnDef: 'updated_at' },
    { header: 'KYC', field: 'kyc', matColumnDef: 'kyc' },
  ];
  displayedColumns = this.columns.map(col => col.matColumnDef);

  constructor() { 
    // this.dataSource.data = ecmiData.data
  }

  ngOnInit(): void {
    // this.getDisplayedColumns()
  }

  private getDisplayedColumns(){
    this.transients.forEach((transient)=>{
      if (this.defaults.includes(transient)){
        this.displayedcolumns.push(transient)
      }
      else{this.hiddenColumns.push(transient)}

      this.displayedcolumns.push('KYC') //Add KYC Column

      if(this.user.can_approve){ //Add Actions column if current user has the permissions
        this.displayedcolumns.push('Actions')
      }

    })
  }

  private buildTableBody(){
    switch(this.customersType){
      case 'prepaid':
        console.log()
        break;
      case 'postpaid':
        console.log()
        break;
      default:
        break
    }

  }

}
