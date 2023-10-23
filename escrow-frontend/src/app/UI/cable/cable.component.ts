import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {isValidPhone, validatePhone} from "../customvalidator.validator";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule,MatPaginator } from '@angular/material/paginator';
import {  CableElectricityService } from 'src/app/services/cableelectricity.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { PaystackService } from 'src/app/services/paystack.service';
// const EventEmitter = require('events')
// const eventEmitter = new EventEmitter()
var self:any 

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
  public ordercreated:any;
  public tv_provider:any;
  public api_provider:any;
  public cart:any = {}
  public Cables:any[] = []
  public Bouquets:any[] = []
  public service_name:any;
  public params:any;
  public chunk_size:number = 2000
  public isRecipientNotValidform:any;
  public paymentSuccess:any;
  public paymentConfirmJson:any;

  constructor( private formBuilder: FormBuilder,
              private cableeclectricityservice: CableElectricityService,
              private http:HttpClient,private router:Router, private paystackService: PaystackService,) {
    
    this.cableeclectricityservice.getCableNetworks().subscribe({
      next:(payload:any) => {
      console.log(payload)
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

  public async directsubscription(){
      let data:any = {}
      this.values = this.form.value
      
      data['api_provider'] = this.api_provider
      data['phonenumber'] = this.values.phone
      data['servicename'] = this.service_name
      data['amount'] = parseFloat(this.amount)
      data['recipient'] = this.values.iuc_no
      data['provider'] = this.values.tv_provider.split(',')[0]
      data['email'] = 'test@gmail.com'
      console.log(data)
    
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
          this.cableeclectricityservice.vendCableSubscription(data).pipe(take(1)).subscribe(
            (payload:any)=>{
                console.log('Cable Tv subscription response ',payload);
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
          this.cableeclectricityservice.vendCableSubscription(data).pipe(take(1)).subscribe(
            (payload:any)=>{
                console.log('Cable Tv subscription response ',payload);
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

  public delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  // public async isRecipientValid(cableform:any) {
  //   this.isRecipientNotValidform='loading'
  //   console.log("Validate cable form ", cableform)
  //   let response:any = this.cableeclectricityservice.validate_recipient('cable',cableform)
  //   response.subscribe({
  //     next:(payload:any) => {
  //       if (payload!=null){
  //       console.log('You aint a ghost =========>',payload);
  //       this.isRecipientNotValidform=false;
  //       eventEmitter.emit('start')
  //       }
  //     }, 
  //     error:(err: any) => {
  //       console.log("Erroooooooors",Object.keys(err),err.status);
  //       if(err.status==400){
  //         this.isRecipientNotValidform=true
  //       };
  //       return false
  //     }
  //   })

  //   // Mock testing to allow development to proceed
  //   await this.delay(3000)
  //   this.isRecipientNotValidform=false;
  //   // 
  // }

  public renameKey(obj:any, old_key:any, new_key:any) {   
    // check if old key = new key  
        if (old_key !== new_key) {                  
           Object.defineProperty(obj, new_key, // modify old key
                                // fetch description from object
           Object.getOwnPropertyDescriptor(obj, old_key) as any);
           delete obj[old_key];                // delete old key
           }
    }
 

  public onBouquetSelected(bouquet_code:string){
    const cableSubObj:any = this.Bouquets.find(x => x.bouquet_code === bouquet_code);
    this.amount = cableSubObj.bouquet_price
    this.service_name =  cableSubObj.bouquet_code
    this.api_provider = cableSubObj.api_provider
  }

  public onOptionsSelected(value:string){
    console.log("the selected value is " + value);
    
    this.cableeclectricityservice.getCabletvBouquets(value.split(',')[1]).subscribe({
      next:(payload:any) => {
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
 
  ngOnInit(): void {
    self = this
    this.form = this.formBuilder.group({
      tv_provider: ['',Validators.required],
      iuc_no: ['',Validators.required],
      phone: ['',[Validators.required]],
      bouquet:['',Validators.required]
     });
     
  }

  ngAfterViewInit() {

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