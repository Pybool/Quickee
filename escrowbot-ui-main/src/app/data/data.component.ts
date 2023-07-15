import { AppState } from './../app.state';
import { PendingOrders } from './../interfaces';
import { Store } from '@ngrx/store';
import { AirtimedataService } from './../services/airtimedata.service';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from './../services/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { TokenstorageService } from '../services/tokenstorage.service';
import { validatePhone,isValidPhone } from "../customvalidator.validator";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
declare function myfunction(): any;
declare function payWithPaystack(method:any,data:any):any;
export interface RecentTransactions {
  network: string;
  recipient: string;
  plan: string;
  amount: string;
  date_time: string;
  status:any;
}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  public uid!:string;
  public form:any;
  public amount:any;
  public values:any;
  public cart:any = {}
  public Data:any[] = []
  public Networks:any[] = []
  public service_name:any;
  public display = false;
  public params:any;
  public api_provider:any;
  public chunk_size:number = 2000
  public transactions:RecentTransactions[] = [
    {network:"---",recipient:"---",plan:"---",amount:"---",date_time:"---", status:"---"},
    {network:"---",recipient:"---",plan:"---",amount:"---",date_time:"---", status:"---"},
    {network:"---",recipient:"---",plan:"---",amount:"---",date_time:"---", status:"---"},
 
    ]

  public displayedColumns:string[] = ['network', 'recipient', 'plan', 'amount', 'date_time', 'status'];
  public dataSource:any = new MatTableDataSource<RecentTransactions>(this.transactions);

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  constructor( private formBuilder: FormBuilder, private cartservice: CartService,
              private tokenstorageservice: TokenstorageService, private http:HttpClient,
              private utilityservice: UtilityService,private airtimedataservice : AirtimedataService
              , private store: Store<AppState>, private router:Router) {

          this.utilityservice.getNetworks().subscribe({
          next:(payload:any) => {
          console.log(payload)
          if (payload.status){
          console.log('Networks ',payload)
          this.Networks = payload.data

          }

          else{}
          },
          error:(err: { error: { msg: string; }; }) => {

          }
          });
      
     }

  public loadPaymentData(order_id:string){

    if(this.cartservice.getcart().status){

      this.values = this.form.value
      const bill_amount = this.values.amount + String('00')
      this.cart['service'] = 'Data subscription'
      this.cart['provider'] = this.values.network
      this.cart['recipient'] = this.values.phone
      this.cart['servicename'] = this.service_name
      this.cart['amount'] = this.amount
      // let data = {email:this.tokenstorageservice.getMail(),amount:bill_amount,phone:this.values.phone,orderRef:`${this.tokenstorageservice.getUser()}`}  
      // window.sessionStorage.setItem("paymentdata",JSON.stringify(data))
      this.cartservice.addtocart(this.cart)
      // window.sessionStorage.setItem("cart",JSON.stringify(cart))
      
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
    let url: string = "/resolve/data/pending/" + order_id
    console.log(metadata)
        //  this.router.navigateByUrl(url,{state: {data: {"metadata":metadata}}});
         metadata['provider_type'] = "Network provider"
         metadata['recipient_type'] = "Phone number"
         metadata['service'] = "data"
         window.sessionStorage.setItem("ResolvePending", JSON.stringify(metadata))
         this.router.navigate([url],{state: {data: {"metadata":metadata}}});

  }

  public async addtocart(){

    this.values = this.form.value
    let network = this.values.network
    // console.log("Blasted network ", network.split(',')[0])
    if (this.values.network !=='' && this.values.phone !=='' && this.values.dataplan !==''){
      let phone_verification = await validatePhone(this.values.phone, network.split(',')[0])
      console.log("Maaaaaaaaaaaad ",network.split(',')[0],network.split(',')[1],network.split(',')[2])
      if (phone_verification){
        let response:any = this.cartservice.getcart()
        if(response.status){
          response = JSON.parse(response.cart)
          console.log("Response from cart ",response)
          this.cart['cart_reference'] = response.cart_reference
        }

        
        this.cart['service'] = 'Data subscription'
        this.cart['provider'] = network.split(',')[1]
        this.cart['recipient'] = this.values.phone
        this.cart['servicename'] = this.service_name
        this.cart['amount'] = this.amount
        this.cart['api_provider'] = this.api_provider
        console.log("data['api_provider'] = ",this.api_provider)
        this.display = true
        // var subject = new Subject<string>();
        
        let cartservicetempfunc_ret_val = this.cartservice.addtocart(this.cart)
        myfunction();
        await this.delay(2000)
        this.display = false;

      }
    
    }

  }

  public delay(ms: number) {
    // alert(9000)
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public async directsubscription(){

      let data:any = {}
      this.values = this.form.value
      data['api_provider'] = this.api_provider
      data['phonenumber'] = this.values.phone
      data['data_code'] = this.service_name
      data['amount'] = String(this.amount) + String('00')
      let mail:any = this.tokenstorageservice.getMail()
      data['email'] = mail.replace(/^["'](.+(?=["']$))["']$/, '$1')
      data['orderRef'] = await this.tokenstorageservice.getUser()
      data['ntwrk_provider'] = this.values.network
      data['order_id'] = this.cartservice.cartuid()
      payWithPaystack("direct",data).then((payment_status:boolean)=>{
        
        console.log("The payment status ",payment_status )
        if (payment_status){
          this.airtimedataservice.data_subscription(data).subscribe(
            (payload)=>{
                console.log('Data subscription response ',payload);
              });
        
        }

      })
  }

  public getdatasubscriptionhistory():any{
    
    let search_by:any;
    let pending_orders:string[] = []
    this.airtimedataservice.getdatasubscriptionhistory(this.uid,search_by='null',this.params='null',this.chunk_size).subscribe((response: any) => {
        // response = JSON.parse(response)
        let data = response.data
        console.log("Electricity subscription history ",data, typeof data)
        this.dataSource.data = data
        console.log("\n\n\nLive data ", data)
        var history:any = {}
        
          for (let order of data){
              if (order.vend_status == false){
                // alert(order.vend_status)
                pending_orders.push(order.order_id)
                order['provider_type'] = "Telcoms Network provider"
                order['recipient_type'] = "Phone number"
                history[''+order.order_id] = order
              }
          }
          
          this.addPendingOrders(pending_orders)
          this.tokenstorageservice.saveHistory(history)

          // window.sessionStorage.setItem('state', JSON.stringify(this.store));
          this.store.subscribe({ // Gets all pending  orders and push the order_id's into the allowed routes array
            next:(pendingOrders:any) => {
              // console.log("Fetched from store ", pendingOrders[0].order_id, Object.keys(pendingOrders))
               console.log("\n\n\nLive datar ", this.transactions, pendingOrders.PendingOrders)
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

  public onDataSelected(value:string){
    this.values = this.form.value
    console.log("the selected value is " + value);
    // Add your profit here for reseller
    this.amount = String(value).split('$')[1];
    this.amount = parseFloat(this.amount) + 100 // NGN100 profit added here 
    console.log("money ", this.amount ,String(value).split('$')[2])
    this.service_name =  String(value).split('$')[0];
    this.api_provider = String(value).split('$')[2];
    console.log(this.api_provider)
  }

  public onOptionsSelected(value:string){
    console.log("the selected value is " + value);
    this.utilityservice.getDataSubscription(Number(value.split(',').pop())).subscribe({
      next:(payload:any) => {
        console.log(payload)
        if (payload.status){
          console.log('Data subscriptions ',payload)
          this.Data = payload.data
        }
      },
      error:(err: { error: { msg: string; }; }) => {}
      });
  
    }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      network: ['',[Validators.required]],
      phone: ['',[Validators.required, isValidPhone]],
      dataplan:['',[Validators.required]],
      
     });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.uid = this.tokenstorageservice.getUser()
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

}
