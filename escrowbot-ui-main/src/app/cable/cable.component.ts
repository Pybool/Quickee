import { AppState } from './../app.state';
import { AirtimedataService } from './../services/airtimedata.service';
import { MatSort } from '@angular/material/sort';
import { CableelectricityService } from './../services/cableelectricity.service';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './../services/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { TokenstorageService } from '../services/tokenstorage.service';
import {isValidPhone, validatePhone} from "../customvalidator.validator";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
import { PendingOrders } from './../interfaces';
import { Store } from '@ngrx/store';
declare function myfunction():any;
declare function payWithPaystack(method:any,data:any):any;

export interface RecentTransactions {
  cable_network: string;
  recipient: string;
  cable_plan: string;
  amount:string;
  date_time: string;
  status:any;
}

@Component({
  selector: 'app-cable',
  templateUrl: './cable.component.html',
  styleUrls: ['./cable.component.css']
})
export class CableComponent implements OnInit {

  public uid!:any;
  public form:any;
  public values:any;
  public amount:any;
  public tv_provider:any;
  public api_provider:any;
  public cart:any = {}
  public Cables:any[] = []
  public Bouquets:any[] = []
  public service_name:any;
  public params:any;
  public chunk_size:number = 2000
  public isRecipientNotValidform:any;

  public transactions:RecentTransactions[] = [
    {cable_network:"---",recipient:"---",cable_plan:"---",amount:"---",date_time:"---", status:"---"},
    {cable_network:"---",recipient:"---",cable_plan:"---",amount:"---",date_time:"---", status:"---"},
    {cable_network:"---",recipient:"---",cable_plan:"---",amount:"---",date_time:"---", status:"---"}
  ]

  public displayedColumns:string[] = ['cable_network', 'recipient', 'cable_plan', 'amount', 'date_time', 'status'];
  public dataSource:any = new MatTableDataSource<RecentTransactions>(this.transactions);

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor( private formBuilder: FormBuilder, private cartservice: CartService,
    private tokenstorageservice: TokenstorageService, private http:HttpClient,
    private utilityservice: UtilityService, private cableelectricityservice: CableelectricityService,
    private airtimedataservice: AirtimedataService, private store: Store<AppState>, private router:Router) {
    
    this.utilityservice.getCableProviders().subscribe({
    next:(payload:any) => {
    console.log(payload)
    // payload = JSON.parse(payload)
    if (payload.status){
    console.log('Cables ',payload)
    this.Cables = payload.data
    let bouquet_select:any = document.getElementById("bouquet_select")
    bouquet_select.selectedIndex = 0;

    }

    else{}
    },
    error:(err: { error: { msg: string; }; }) => {}
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

  ResolvePending(order_id : any, metadata:any){
    let url: string = "/resolve/cable/pending/" + order_id
    console.log(metadata)
        //  this.router.navigateByUrl(url,{state: {data: {"metadata":metadata}}});
          metadata['provider_type'] = "Cable tv provider"
          metadata['recipient_type'] = "Smartcard-IUC number"
          metadata['service'] = "cable"
          window.sessionStorage.setItem("ResolvePending", JSON.stringify(metadata))
          this.router.navigate([url],{state: {data: {"metadata":metadata}}});

  }

  public async directsubscription(){
      let data:any = {}
      this.values = this.form.value
      data['api_provider'] = this.api_provider
      data['phonenumber'] = this.values.phone
      data['servicename'] = this.service_name
      data['amount'] = String(parseFloat(this.amount) * 100)
      let mail:any = this.tokenstorageservice.getMail()
      data['email'] = mail.replace(/^["'](.+(?=["']$))["']$/, '$1') //remove leading and trailing spaces from mail string
      data['orderRef'] = await this.tokenstorageservice.getUser()
      data['provider'] = this.values.tv_provider
      data['order_id'] = this.cartservice.cartuid()
      data['recipient'] = this.values.iuc_no
      data['provider'] = this.values.tv_provider
    
    payWithPaystack("direct",data).then((payment_status:boolean)=>{
      
      console.log("The payment status ",payment_status )
      if (payment_status){
        this.cableelectricityservice.cable_subscription(data).subscribe(
          (payload)=>{
              console.log('Cable subscription response ',payload);
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

  public async isRecipientValid(cableform:any) {
    // var p = control.value
    this.isRecipientNotValidform='loading'
    console.log("Validate cable form ", cableform)
    // let response:any = this.cableelectricityservice.validate_recipient('cable',cableform)
    // response.subscribe({
    //   next:(payload:any) => {if (payload!=null){console.log('You aint a ghost =========>',payload);this.isRecipientNotValidform=false;eventEmitter.emit('start')}}, error:(err: any) => {console.log("Erroooooooors",Object.keys(err),err.status); if(err.status==400){this.isRecipientNotValidform=true};return false}
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
 

  public getcablehistory():any{
    let search_by:any;
    this.cableelectricityservice.getcablesubscriptionhistory(this.uid,search_by='null',this.params='null',this.chunk_size).subscribe((response: any) => {
        // response = JSON.parse(response)
        let pending_orders:string[] = []
        let data = response.data
        console.log("Cable history ",data, typeof data)
        console.log("Dummy data ",this.transactions)
        this.dataSource.data = data
        console.log("\n\n\nLive data ", this.transactions)
        var history:any = {}
        
        for (let order of data){
            if (order.vend_status == false){
              this.renameKey(order, 'cable_network', 'network')
              this.renameKey(order, 'amount_charged', 'amount')
              pending_orders.push(order.order_id)
              order['provider_type'] = "Cable tv provider"
              order['recipient_type'] = "Smartcard-IUC number"
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

  public applyFilter(filterValue: Partial<HTMLInputElement> | null) {
      // alert(filterValue!.value)
      filterValue = String(filterValue!.value).trim(); // Remove whitespace
      filterValue = String(filterValue).toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
  }

  public cableemitter(){
    
    eventEmitter.on('start', (number:any) => {
      
      // initValidation();
      // initValidation.prototype.validate(  );
      let x:any = this.addtocart()
      console.log(`Cable verification completed just now`)
      // eventEmitter.removeAllListeners(["start"])
      // x.prototype.validate()
    })

  
  }

  public validate(this: any){
    console.log( "test"  );
      this.cart['api_provider'] = this.api_provider
      console.log("data['api_provider'] = ",this.api_provider)
      this.cart['service'] = 'Cable subscription'
      this.cart['provider'] = this.tv_provider
      this.cart['recipient'] = this.values.iuc_no
      this.cart['phonenumber'] = this.values.phone
      this.cart['servicename'] = this.service_name
      this.cart['amount'] = 2500
      console.log(100000000000000000000000000)
      let cartservicetempfunc_ret_val = this.cartservice.addtocart(this.cart)
      console.log(200000000000000000000000000)
    
      console.log('stage 3',cartservicetempfunc_ret_val)
      // payload = JSON.parse(payload)
      if (cartservicetempfunc_ret_val){console.log("New cable subscription item was added to cart"); myfunction();return null}
      else {console.log("New cable subscription item was not added to cart in backend");}
      // subject.next(payload)
      return null
        

      
    // let data = {email:this.tokenstorageservice.getMail(),amount:bill_amount,phone:this.values.phone,orderRef:`${this.tokenstorageservice.getUser()}`}  
    // window.sessionStorage.setItem("paymentdata",JSON.stringify(data))
  }

  public addtocart(){

    this.values = this.form.value
    const bill_amount = this.values.amount + String('00')
    this.tv_provider = this.values.tv_provider
    if (this.values.tv_provider !=='' && this.values.phone !=='' && this.values.iuc_no !==''){
      validatePhone(this.values.phone).then((phone_verification:any) =>{

        console.log("phone verification status ",phone_verification)
        if (phone_verification){
          // this.isRecipientValid(this.form.value).then(()=>{

            console.log(4444448888444,this.isRecipientNotValidform)
            this.validate()
            return null
            
            // let props:any = this.addtocart
            // props.validate = validate;
          // })
        }
      })
  }
  return null
}

  public onBouquetSelected(value:string){
    console.log("the selected value is " + value);
    this.amount = String(value).split('$')[1];
    console.log("money ", this.amount)
    this.service_name =  String(value).split('$')[0];
    this.api_provider = String(value).split('$')[2];
    console.log(this.api_provider)
  }

  public onOptionsSelected(value:string){
    console.log("the selected value is " + value);
    
    this.utilityservice.getCabletvBouquets(Number(value.split(',').pop())).subscribe({
      next:(payload:any) => {
      console.log(payload)
      // payload = JSON.parse(payload)
      if (payload.status){
      console.log('Cable tv subscriptions ',payload)
      this.Bouquets = payload.data
      let bouquet_select:any = document.getElementById("bouquet_select")
      bouquet_select.selectedIndex = 0;
      

      }

      else{}
      },
      error:(err: { error: { msg: string; }; }) => { }
      });
  
    }
    // MULTIPLE INHERITANCE
    // public applyMixins(derivedCtor: any, baseCtors: any[]) {
    //   baseCtors.forEach(baseCtor => {
    //       Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
    //            if (name !== 'constructor') {
    //               derivedCtor.prototype[name] = baseCtor.prototype[name];
    //           }
    //       });
    //   }); 
    // }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      tv_provider: ['',Validators.required],
      iuc_no: ['',Validators.required],
      phone: ['',[Validators.required, isValidPhone]],
      bouquet:['',Validators.required]
     });
     
  }

  ngAfterViewInit() {
    this.uid = this.tokenstorageservice.getUser()
    this.dataSource.paginator = this.paginator;
    this.cableemitter()
  
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

}




