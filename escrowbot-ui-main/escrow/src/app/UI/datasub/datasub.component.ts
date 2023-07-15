
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
import { UtilityService } from 'src/app/services/utility.service';
import { PaystackService } from 'src/app/services/paystack.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { AirtimeDataService } from 'src/app/services/airtimedata.service';
import { take } from 'rxjs';
var self:any;

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
  templateUrl: './datasub.component.html',
  styleUrls: ['./datasub.component.css']
})
export class DataSubComponent implements OnInit {

  public uid!:string;
  public ordercreated:any
  public form:any;
  public amount:any;
  public values:any;
  public cart:any = {}
  public Data:any[] = []
  public Networks:any[] = []
  public service_name:any;
  public display = false;
  public params:any;
  public paymentSuccess:boolean = false;
  public api_provider:any;
  private paymentConfirmJson:any;
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
  constructor( private formBuilder: FormBuilder,private utilityservice: UtilityService,private paystackService: PaystackService,
              private http:HttpClient,private router:Router, private authService: AuthService,private airtimedataservice:AirtimeDataService) {
              

          
     }

 
  public delay(ms: number) {
    // alert(9000)
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public directsubscription(){

      let data:any = {}
      this.values = this.form.value
      data['api_provider'] = this.api_provider
      data['phonenumber'] = this.values.phone
      data['data_code'] = this.service_name
      data['amount'] = this.amount
      data['email'] = 'tester@yahoo.com'
      data['ntwrk_provider'] = this.values.network
      // const status:any = false;
      this.initiatePayment(Math.round(data.amount),data.email).then(async(status:any)=>{
        console.log("Status ---> ",await status)
        if(status[0]==true){
          data['paid'] = true;
          data['transaction'] = status[1]
          Swal.fire({
            position: 'top-start',
            icon: 'success',
            title: `Order Created!`,
            text:`Your data has been sent and your payment verified!`,
            showConfirmButton: false,
            timer: 1500
          })
          this.ordercreated = false
          console.log("Payload =====> ", data)
          this.airtimedataservice.vendData(data).pipe(take(1)).subscribe(
            (payload:any)=>{
                console.log('Data subscription response ',payload);
            }
          );
          
        }

        else if(status==false){
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
          this.airtimedataservice.vendData(data).pipe(take(1)).subscribe(
            (payload:any)=>{
                console.log('Data subscription response ',payload);
            }
          );
        }
        else if(this.ordercreated==false && status==false){
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

  public onDataSelected(value:string){
    this.values = this.form.value
    const dataSubObj:any = this.Data.find(x => x.plan_code === value);
    // Add your profit here for reseller
    this.amount = dataSubObj.plan_price + 100 // NGN100 profit added here 
    this.service_name =  dataSubObj.plan_code;
    this.api_provider = dataSubObj.api_provider;
  }

  public onOptionsSelected($event:any){
    this.utilityservice.getDataSubscription(($event.target.value.split(',').pop())).subscribe({
      next:(payload:any) => {
        if (payload.status){
          console.log('Data subscriptions ',payload)
          this.Data = payload.data
        }
      },
      error:(err: { error: { msg: string; }; }) => {}
      });
  
    }

  ngOnInit(): void {
    self = this
    this.form = this.formBuilder.group({
      network: ['',[Validators.required]],
      phone: ['',[Validators.required,]],
      dataplan:['',[Validators.required]],
      
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
