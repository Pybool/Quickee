// import { ADD_PENDING_ORDER } from './../reducers/resolve.reducer';
// import { AppState } from './../app.state';
import { NONE_TYPE } from '@angular/compiler';
// import { AirtimedataService } from './../services/airtimedata.service';
// import { UtilityService } from './../services/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
// import { CartService } from '../services/cart.service';
// import { TokenstorageService } from '../services/tokenstorage.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {isValidPhone, validatePhone, isAirtimeAmountValid} from "../customvalidator.validator";
// import {MatPaginator, MatTableDataSource} from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter, take } from 'rxjs/operators';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';
import { PaystackService } from 'src/app/services/paystack.service';
import { AirtimeDataService } from 'src/app/services/airtimedata.service';

// var mouse = require('macmouse');

var self:any;
declare function myfunction(): any;
declare function payWithPaystack(method:any,data:any):any;
// const element = event.currentTarget as HTMLInputElement
// const value = element.value


export interface RecentTransactions {
  network: string;
  recipient: string;
  amount: string;
  date_time: string;
  status:any;
}



@Component({
  selector: 'app-airtime',
  templateUrl: './airtime.component.html',
  styleUrls: ['./airtime.component.css']
})
export class AirtimeComponent implements OnInit {

  public uid!: string;
  public form:any;
  public values:any;
  public cart:any = {}
  public api_provider:any;
  public Networks:any[] = []
  public params:any;
  public chunk_size:number = 2000
  public display:any = false
  ordercreated:boolean = false
  paymentSuccess:any
  paymentConfirmJson:any
  public transactions:RecentTransactions[] = [
    {network:"---",recipient:"---",amount:"---",date_time:"---", status:"---"},
    {network:"---",recipient:"---",amount:"---",date_time:"---", status:"---"},
    {network:"---",recipient:"---",amount:"---",date_time:"---", status:"---"},
 
    
  
    ]
  
    
  public displayedColumns:string[] = ['network', 'recipient', 'amount', 'date_time', 'status'];
  public dataSource:any = new MatTableDataSource<RecentTransactions>(this.transactions);
  public pendingorders_obs:any ;
  public pendingorders:any;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

 
  constructor( private formBuilder: FormBuilder,private utilityservice: UtilityService,private airtimedataservice:AirtimeDataService,
                private http:HttpClient,private router: Router,private paystackService: PaystackService,
              ) {}
  
  ngOnInit(): void {
    self = this
    this.form = this.formBuilder.group({
      network: ['',[Validators.required]],
      phone: ['',[Validators.required,]],
      amount:['',[Validators.required,]]
     });

     this.utilityservice.getNetworks().subscribe({
      next:(payload:any) => {
        if (payload.status){
          console.log('Networks ',payload)
          this.Networks = payload.data
        }
        else{ }
      },
      error:(err: { error: { msg: string; }; }) => { }
      });
                 
  }
  

  public submit(){
    let data:any = {}
    data = this.values = this.form.value
    data['email'] = 'test@gmail.com'
    const dataSubObj:any = this.Networks.find(x => x.isp_name === this.values.network.toUpperCase());
    data['ntwrk_provider'] = this.values.network
    data['api_provider'] = dataSubObj.api_provider
    console.log(data)
    data['route'] = this.router.url

    this.initiatePayment(Math.round(data.amount),data.email).then(async(status:any)=>{
      console.log("Status ---> ",await status)
      if(status[0]==true){
        data['paid'] = true;
        data['transaction'] = status[1]
        this.ordercreated = false
        console.log("Payload =====> ", data)
        this.airtimedataservice.vendAirtime(data).pipe(take(1)).subscribe(
          (payload:any)=>{
              console.log('Airtime subscription response ',payload);
              if(payload.status){
                Swal.fire({
                  position: 'top-start',
                  icon: 'success',
                  title: `Airtime Purchase Successful!`,
                  text:payload.message,
                  showConfirmButton: false,
                  timer: 1500
                })
              }
              else{
                Swal.fire({
                  position: 'top-start',
                  icon: 'error',
                  title: `Airtime Purchase Failed!`,
                  text:payload.message,
                  showConfirmButton: false,
                  timer: 1500
                })
              }
          }
        );
      }

      else if(status[0]==false){
        data['paid'] = false;
        data['transaction'] = status[1]
        Swal.fire({
          position: 'top-start',
          icon: 'warning',
          title: `Payment confirmation is pending!`,
          text:`Your payment awaits verification!`,
          showConfirmButton: false,
          timer: 1500
        })
        this.ordercreated = false
        this.airtimedataservice.vendAirtime(data).pipe(take(1)).subscribe(
          (payload:any)=>{
              console.log('Airtime subscription response ',payload);
          }
        );
      }
      else if(this.ordercreated==false && status[0]==false){
        Swal.fire({
          position: 'top-start',
          icon: 'error',
          title: `Order not created`,
          text:`Your order and payment could not be processed, if you were debited please send a mail to us.`,
          showConfirmButton: false,
          timer: 1500
        })
        this.ordercreated = false
        
      }
    })
  }



  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public networkSelected(value:any){
    console.log("the selected value is " + value);
    this.api_provider = String(value).split(',')[1];
    
  
    }

  public applyFilter(filterValue: Partial<HTMLInputElement> | null) {
      // alert(filterValue!.value)
      filterValue = String(filterValue!.value).trim(); // Remove whitespace
      filterValue = String(filterValue).toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.uid = this.tokenstorageservice.getUser()
    // myfunction()
  }

  initiatePayment(amount:number,email:string) {
    console.log(amount,email)
    return new Promise((resolve,reject)=>{
      this.paystackService.initiatePayment(amount, email, (response) => {
        console.log("Reference------> ", response.reference)
        if (response.status === 'success') {
          // Payment was successful, verify the transaction
          resolve(this.verifyTransaction(response.reference));
        } else {
          // Payment was not successful
          reject(this.verifyTransaction(response.reference));
        }

      });
    })
  }

  verifyTransaction(reference: string) {
    return new Promise((resolve:any,reject:any)=>{
      this.paystackService.verifyTransaction(reference, (response) => {
        // Handle the transaction verification callback
        self.paymentSuccess =  response.data.status == 'success'
        self.paymentConfirmJson = response.data
        console.log(self.paymentConfirmJson)
        resolve([self.paymentSuccess,self.paymentConfirmJson])
      });
    })
    // return [this.paymentSuccess, this.paymentConfirmJson]
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

}
