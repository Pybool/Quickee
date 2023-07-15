// import { ADD_PENDING_ORDER } from './../reducers/resolve.reducer';
import { AppState } from './../app.state';
import { NONE_TYPE } from '@angular/compiler';
import { AirtimedataService } from './../services/airtimedata.service';
import { UtilityService } from './../services/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { TokenstorageService } from '../services/tokenstorage.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {isValidPhone, validatePhone, isAirtimeAmountValid} from "../customvalidator.validator";
// import {MatPaginator, MatTableDataSource} from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter } from 'rxjs/operators';
import { PendingOrders } from './../interfaces';
import { Store } from '@ngrx/store';
import { AlertComponent } from '../alert/alert.component';
// var mouse = require('macmouse');


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

  public pendingOrders!: Observable<PendingOrders[]>;
  constructor( private formBuilder: FormBuilder, private cartservice: CartService,private alertcomponent:AlertComponent,
               private tokenstorageservice: TokenstorageService, private http:HttpClient,private router: Router,
               private utilityservice: UtilityService, private airtimedataservice : AirtimedataService, private store: Store<AppState>) {
  
  // this.pendingOrders = this.store.select(state => state.pendingOrders);


  this.utilityservice.getNetworks().subscribe({
      next:(payload:any) => {
        console.log(payload)
        // payload = JSON.parse(payload)
        if (payload.status){
          console.log('Networks ',payload)
          this.Networks = payload.data
        }
        else{ }
      },
      error:(err: { error: { msg: string; }; }) => { }
  });
                 
  }
  
  addPendingOrders(pending_orders:string[]) {
    console.log("Pending orders to be saved in store ", pending_orders)
    this.store.dispatch({
      type: 'ADD_PENDING_ORDER',
      payload: <PendingOrders> <unknown>{
        order_id: pending_orders
      }
    });
  }


  public loadPaymentData(order_id:string){

    if(this.cartservice.getcart().status){

      this.values = this.form.value
      const bill_amount = this.values.amount + String('00')
      this.cart['service'] = 'Airtime purchase'
      this.cart['provider'] = this.values.network
      this.cart['recipient'] = this.values.phone
      this.cart['servicename'] = 'Airtime'
      this.cart['amount'] = this.values.amount
      // let data = {email:this.tokenstorageservice.getMail(),amount:bill_amount,phone:this.values.phone,orderRef:`${this.tokenstorageservice.getUser()}`} 
      // window.sessionStorage.setItem("paymentdata",JSON.stringify(data))
      this.cartservice.addtocart(this.cart)
      // window.sessionStorage.setItem("cart",JSON.stringify(cart))
    }
    
  }

  ResolvePending(order_id : any, metadata:any){
    let url: string = "/resolve/airtime/pending/" + order_id
    console.log(metadata)
        //  this.router.navigateByUrl(url,{state: {data: {"metadata":metadata}}});
         metadata['provider_type'] = "Network provider"
         metadata['recipient_type'] = "Phone number"
         metadata['service'] = "airtime"
         window.sessionStorage.setItem("ResolvePending", JSON.stringify(metadata))
         this.router.navigate([url],{state: {data: {"metadata":metadata}}});

  }

  public async directrecharge(){
    let data:any = {}
    this.values = this.form.value
    data['phonenumber'] = this.values.phone
    data['amount'] = String(this.values.amount) + String('00')
    let mail:any = this.tokenstorageservice.getMail()
    data['email'] = mail.replace(/^["'](.+(?=["']$))["']$/, '$1')
    data['orderRef'] = await this.tokenstorageservice.getUser()
    data['ntwrk_provider'] = this.values.network
    data['order_id'] = this.cartservice.cartuid()
    data['route'] = this.router.url
    console.log("route", this.router.url)
    payWithPaystack("direct",data).then((payment_status:boolean)=>{
      
      console.log("The payment status ",payment_status )
      if (payment_status){
        this.airtimedataservice.airtime_purchase(data).subscribe(
          (payload)=>{
              console.log('Airtime recharge response ',payload);
              if(payload.status){
                this.alertcomponent.showalert(`${payload.data['network']} airtime recharge of NGN${payload.data['amount']/100} was successful`)
              }
            });
      }
    })
  }

  public async addtocart(){
    
    this.values = this.form.value
    console.log("Form values ", this.values)
    // control.value && control.value.length != 10
    if (this.values.network !=='' && this.values.phone !=='' && this.values.amount !==''){
      let phone_verification = await validatePhone(this.values.phone, this.values.network)
      if (phone_verification){

        const bill_amount = this.values.amount + String('00')
        this.cart['service'] = 'Airtime purchase'
        this.cart['provider'] = this.values.network
        this.cart['recipient'] = this.values.phone
        this.cart['servicename'] = 'Airtime'
        this.cart['amount'] = this.values.amount
        this.cart['api_provider'] = this.api_provider
        
        this.display = true
        // var subject = new Subject<string>();
        
        let cartservicetempfunc_ret_val = this.cartservice.addtocart(this.cart)
        myfunction();
        await this.delay(4000)
        this.display = false;

      }
      else{console.log('Phone number does not match specified network');}
      
    }
    
  }

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public getairtimehistory():any{
      let search_by:any;
      try{this.tokenstorageservice.clearState(); console.log("Clearing local state ")}
      catch(err:any){"Error occured clearing state"}
            
      this.airtimedataservice.getairtimehistory(this.uid,search_by='null',this.params='null',this.chunk_size).subscribe((response: any) => {
          // response = JSON.parse(response)
          let pending_orders:string[] = []
          let data = response.data
          console.log("Airtime history ",data, typeof data)
          console.log("Dummy data ",this.transactions)
          this.transactions = data
          this.dataSource.data = data
          var history:any = {}
        
          for (let order of data){
              if (order.vend_status == false){
                pending_orders.push(order.order_id)
                order['provider_type'] = "Telcoms Network provider"
                order['recipient_type'] = "Phone number"
                order['service'] = "airtime"
                history[''+order.order_id] = order
              }
          }
          this.addPendingOrders(pending_orders)
          this.tokenstorageservice.saveHistory(history)

          // window.sessionStorage.setItem('state', JSON.stringify(this.store));
          this.store.subscribe({ // Gets all pending  orders and push the order_id's into the allowed routes array
            next:(pendingOrders:any) => {
              // console.log("Fetched from store ", pendingOrders[0].order_id, Object.keys(pendingOrders))
               console.log("\n\n\nLive data ", this.transactions, pendingOrders.PendingOrders)
              //  console.log("Query state ", this.tokenstorageservice.getState())
               this.tokenstorageservice.saveState(JSON.stringify(pendingOrders))
           
            }

          })
          
      })
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

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      network: ['',[Validators.required]],
      phone: ['',[Validators.required, isValidPhone]],
      amount:['',[Validators.required,isAirtimeAmountValid]]
     });
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.uid = this.tokenstorageservice.getUser()
    // myfunction()
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

}
