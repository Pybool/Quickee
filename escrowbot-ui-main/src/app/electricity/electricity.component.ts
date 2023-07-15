import { PendingOrders } from './../interfaces';
import { AppState } from './../app.state';
import { Store } from '@ngrx/store';
import { MatSort } from '@angular/material/sort';
import { CableelectricityService } from './../services/cableelectricity.service';
import { UtilityService } from './../services/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { TokenstorageService } from '../services/tokenstorage.service';
import {isValidPhone, validatePhone, isElectricityAmountValid} from "../customvalidator.validator";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
declare function myfunction():any
declare function payWithPaystack(method:any,data:any):any;

export interface RecentTransactions {
  disco: string;
  recipient: string;
  amount: string;
  token: string;
  date_time: string;
  status:any;
}

@Component({
  selector: 'app-electricity',
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.css']
})
export class ElectricityComponent implements OnInit {

  public uid!:string;
  public form:any;
  public values:any;
  public api_code:any;
  public cart:any = {};
  public Discos:any[] = [];
  public params:any;
  public api_provider:any;
  public chunk_size:number = 2000
  public prepaid:string = "prepaid";
  public postpaid:string = "postpaid";
  public isRecipientNotValidform:any;

  public transactions:RecentTransactions[] = [
    {disco:"---",recipient:"---",amount:"---",token:"---", date_time:"---", status:"---"},
    {disco:"---",recipient:"---",amount:"---",token:"---", date_time:"---", status:"---"},
    {disco:"---",recipient:"---",amount:"---",token:"---", date_time:"---", status:"---"},
    ]
  

  public displayedColumns:string[] = ['disco', 'recipient', 'amount', 'token', 'date_time', 'status'];
  public dataSource:any = new MatTableDataSource<RecentTransactions>(this.transactions);

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;


  constructor(private formBuilder: FormBuilder, private cartservice: CartService,
              private tokenstorageservice: TokenstorageService, private utilityservice: UtilityService,
              private cableelectricityservice: CableelectricityService, private store: Store<AppState>, private router:Router) {
                
                this.utilityservice.getElectrictyDiscos().subscribe({
                  next:(payload:any) => {
                  console.log(payload)
                  // payload = JSON.parse(payload)
                  if (payload.status){
                  console.log('Discos ',payload)
                  this.Discos = payload.data
                  }
              
                  else{}
                  },
                  error:(err: { error: { msg: string; }; }) => {
                  }
                  });

              }

  private toSentenceCase(value:string){
      var text = value;
      var result = text.replace( /([A-Z])/g, "$1" );
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      console.log("To sentence case ",finalResult);
      return finalResult
      
  }

  public async directpurchase(){

      let data:any = {}
      this.values = this.form.value
      data['phonenumber'] = this.values.phone
      data['meter_type'] = this.values.meter_type
      data['amount'] = String(parseFloat(this.values.amount) * 100)
      let mail:any = this.tokenstorageservice.getMail()
      data['email'] = mail.replace(/^["'](.+(?=["']$))["']$/, '$1') //remove leading and trailing spaces from mail string
      data['orderRef'] = await this.tokenstorageservice.getUser()
      data['order_id'] = this.cartservice.cartuid()
      data['recipient'] = this.values.meter_no
      data['provider'] = this.values.disco
      data['servicetype'] = "Electricity purchase" 
      data['api_provider'] = this.api_provider
      data['this.api_code'] = this.api_code
      console.log("power data ", data)

      payWithPaystack("direct",data).then((payment_status:boolean)=>{
        
        console.log("The payment status ",payment_status )
        if (payment_status){
          this.cableelectricityservice.electricity_subscription(data).subscribe(
            (payload)=>{
                console.log('Electricity purchase payment response ',payload);
              });
        
        }

      })
}

  public linker(){
    this.isRecipientValid(this.form.value)
  }

  public delay(ms: number) {
    // alert(9000)
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public async addtocart(){

    this.values = this.form.value
    const bill_amount = String(parseFloat(this.values.amount) * 100)
    let disco = this.values.disco
    if (this.values.disco !=='' && this.values.phone !=='' && this.values.meter_no !=='' && this.values.meter_type !=='' && this.values.amount !==''){
      let phone_verification:any = await validatePhone(this.values.phone)
      if (phone_verification){
        
        console.log(4444448888444,this.isRecipientNotValidform)
        this.validate()
        return null
        
      }
 
    }

  }


  public async isRecipientValid(electricityform:any) {
    this.isRecipientNotValidform='loading'
    console.log("Validate electricity form ", electricityform)
    // let response:any = this.cableelectricityservice.validate_recipient("electricity",electricityform)
    // response.subscribe({
    //   next:(payload:any) => {console.log(payload);this.isRecipientNotValidform=false}, error:(err: any) => {console.log("Erroooooooors",Object.keys(err),err.status); if(err.status==400){this.isRecipientNotValidform=true};return false}
    // })

    // Mock testing to allow development to proceed
    await this.delay(3000)
    this.isRecipientNotValidform=false;
    eventEmitter.emit('start')
    console.log("start emitted")
    // 


  }

  public renameKey(obj:any, old_key:any, new_key:any) {   
    // check if old key = new key  
        if (old_key !== new_key) {                  
           Object.defineProperty(obj, new_key, // modify old key
                                // fetch description from object
           Object.getOwnPropertyDescriptor(obj, old_key) as any);
           delete obj[old_key];                // delete old key
           }
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

    ResolvePending(order_id : any, metadata:any){
      let url: string = "/resolve/electricity/pending/" + order_id
      console.log(metadata)
          //  this.router.navigateByUrl(url,{state: {data: {"metadata":metadata}}});
            metadata['provider_type'] = "disco"
            metadata['recipient_type'] = "Meter number"
            metadata['service'] = "electricity"
            window.sessionStorage.setItem("ResolvePending", JSON.stringify(metadata))
            this.router.navigate([url],{state: {data: {"metadata":metadata}}});
  
    }

  public getelectricityhistory():any{
    let search_by:any;
    this.cableelectricityservice.getelectricitypurchasehistory(this.uid,search_by='null',this.params='null',this.chunk_size).subscribe((response: any) => {
        // response = JSON.parse(response)
        let pending_orders:string[] = []
        let data = response.data
        console.log("Electricity history ",data, typeof data)
        console.log("Dummy data ",this.transactions)
        this.dataSource.data = data
        console.log("\n\n\nLive data ", this.transactions)
        var history:any = {}
        
        for (let order of data){
            if (order.vend_status == false){
              // this.renameKey(order, 'cable_network', 'network')
              // this.renameKey(order, 'amount_charged', 'amount')
              pending_orders.push(order.order_id)
              order['provider_type'] = "Disco"
              order['recipient_type'] = "Meter number"
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
             this.tokenstorageservice.saveState(JSON.stringify(pendingOrders))
         
          }

        })
    })
}

  public applyFilter(filterValue: Partial<HTMLInputElement> | null) {
    // alert(filterValue!.value)
    filterValue = String(filterValue!.value).trim(); // Remove whitespace
    filterValue = String(filterValue).toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
}

  public discoemitter(){
    
    eventEmitter.on('start', (number:any) => {
      
      // initValidation();
      // initValidation.prototype.validate(  );
      let x:any = this.addtocart()
      console.log(`Electricity verification completed just now`)
      // eventEmitter.removeAllListeners(["start"])
      // x.prototype.validate()
    })

  
  }

  public validate(this: any){
    console.log( "test disco"  );
      let disco = this.values.disco
      this.cart['service'] = 'Electricity purchase'
      // this.cart['provider'] = this.toSentenceCase(disco.split(',')[0])
      this.cart['provider'] = disco
      this.cart['recipient'] = this.values.meter_no
      this.cart['servicename'] = this.values.meter_type
      this.cart['amount'] = this.values.amount
      this.cart['phonenumber'] = this.values.phone
      this.cart['api_provider'] = this.api_provider
      this.cart['api_code'] = this.api_code
      console.log('Verify ',this.api_provider, this.api_code)
      let cartservicetempfunc_ret_val = this.cartservice.addtocart(this.cart)
      
      console.log('stage 3',cartservicetempfunc_ret_val)
      // payload = JSON.parse(payload)
      if (cartservicetempfunc_ret_val){console.log("New Electricity purchase item was added to cart", this.cart); myfunction();return null}
      else {console.log("New Electricity purchase item was not added to cart in backend");}
      // subject.next(payload)
      return null
        

      
    // let data = {email:this.tokenstorageservice.getMail(),amount:bill_amount,phone:this.values.phone,orderRef:`${this.tokenstorageservice.getUser()}`}  
    // window.sessionStorage.setItem("paymentdata",JSON.stringify(data))
  }

  public discoSelected(value:any){
    console.log("the selected value is " + value);
    this.api_provider = String(value).split(',')[3];
    this.api_code = String(value).split(',')[4];
    console.log(this.api_provider, this.api_code)
  
    }


  public onOptionsSelected(value:any){
    console.log("the selected value is " + value);
   
  
    }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      disco: ['',Validators.required],
      meter_no: ['',Validators.required],
      meter_type:['',Validators.required],
      amount: ['',[Validators.required,isElectricityAmountValid]],
      phone: ['',[Validators.required, isValidPhone]],
      api_provider:['']
     });

  
  }

  ngAfterViewInit() {
    this.uid = this.tokenstorageservice.getUser()
    this.dataSource.paginator = this.paginator;
    this.discoemitter()
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

}
