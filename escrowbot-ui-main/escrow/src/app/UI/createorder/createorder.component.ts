import { Component , OnChanges} from '@angular/core';
import { INewOrder, NewOrder } from './createorder.model';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { take } from 'rxjs';
import { PaystackService } from 'src/app/services/paystack.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

var self:any;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-createorder',
  templateUrl: './createorder.component.html',
  styleUrls: ['./createorder.component.css']
})
export class CreateorderComponent {
  public escrowfee:number = 0.00
  public newOrder:any = new NewOrder()
  emailRequiredError:any;
  emailInvalidError:any;
  selectedFiles:any;
  formData:any;
  startpayment:boolean = false;
  currentuser:any
  paymentSuccess = false
  ordercreated = false
  placeHolderActive = true;
  nonExistentVendor:boolean = false;
  
  

  constructor(private orderService: OrderService, 
              private paystackService:PaystackService,
              private authService: AuthService,
              private userService: UserService,
              private router:Router){}

  ngOnInit(){
    this.orderService.getMetaData().pipe(take(1)).subscribe((response:any)=>{
      if(response.status){
        this.escrowfee = response.data.escrow_fee
        setTimeout(()=>{
          const escrowfee:any = document.querySelector('.escrowfee')
          escrowfee.value = this.escrowfee
        },100)
      }
    })
  }

  ngAfterViewInit(){
    self = this
    this.currentuser = this.authService.retrieveUser()
    this.newOrder.buyer_email = this.currentuser.email
    
  }

  validateEmail() {
    
    if (!this.newOrder.buyer_email) {
      this.emailRequiredError = true;
      this.emailInvalidError = false;
    } else if (!emailRegex.test(this.newOrder.seller_email)) {
      this.emailRequiredError = false;
      this.emailInvalidError = true;
    } else {
      this.emailRequiredError = false;
      this.emailInvalidError = false;
    }
  }

  userExists(value:any){
    if (emailRegex.test(this.newOrder.seller_email)) {
      console.log("Firing now",value)
        this.userService.userExists({email:value}).subscribe((response)=>{
          console.log(response.status)
          if(response.status){
            this.nonExistentVendor = false;
          }
          else{
            this.nonExistentVendor = true;
          }
        })
    }
   
  }

  activatePayment(){
    const paybtn:any = document.querySelector('.paybtn')
    if(this.newOrder.seller_email !=undefined && 
      this.newOrder.buyer_email !=undefined && 
      this.newOrder.order_units !=undefined &&
      this.newOrder.unit_price != undefined &&
      (this.newOrder.description != undefined || this.newOrder?.description?.trim() != '') &&
      this.newOrder?.description?.trim().length > 10
      ){
        this.placeHolderActive = false;
        paybtn.style.opacity = '1'
      }
    
      else{
        this.placeHolderActive = true;
        paybtn.style.opacity = '0.6'
      }
    
  }

  submit(){
    this.placeHolderActive = true
    this.validateEmail()
    const amount = parseFloat(this.newOrder.agreed_price) + this.escrowfee
    const email = this.newOrder.buyer_email

        if(this.emailRequiredError == false && this.emailInvalidError == false){
          this.getOrderMetadata()
          this.orderService.createOrder({'file':this.formData,'data':this.newOrder}).pipe(take(1)).subscribe((response)=>{
            
            if(response.status){
              this.startpayment = true
              this.ordercreated = true
              this.router.navigate(['/new-order'],{queryParams:{orderId:response.data}})
              if(this.newOrder.payment_channel == 'Debit Card'){
                this.initiatePayment(Math.round(amount),email,response.data).then((status)=>{
                  console.log("Status ---> ",status)
                  if(this.ordercreated==true && status==true){
                    // this.orderService.confirmPayment(response.data).subscribe()
                    Swal.fire({
                      position: 'top-start',
                      icon: 'success',
                      title: `Order Created!`,
                      text:`Your order has been placed and your payment verified!`,
                      showConfirmButton: false,
                      timer: 1500
                    })
                    this.ordercreated = false
                    this.authService.navigateToUrl('orders')
                    
                  }
          
                  else if(this.ordercreated==true && status==false){
                    Swal.fire({
                      position: 'top-start',
                      icon: 'warning',
                      title: `Payment confirmation is pending!`,
                      text:`Your order has been placed but your payment awaits verification!`,
                      showConfirmButton: false,
                      timer: 1500
                    })
                    this.ordercreated = false
                    this.authService.navigateToUrl('orders')
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
              
              
            }
            
            else{
              Swal.fire({
                position: 'top-start',
                icon: 'error',
                title: `Order was not created!`,
                text:`Your order could not be placed!`,
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
        }
        else{
          Swal.fire({
            position: 'top-start',
            icon: 'error',
            title: `Incomplete order!`,
            text:`Please fill out all required fields`,
            showConfirmButton: false,
            timer: 1500
          })
        }

  }

  onLoadPaymentData(event:any) {
    console.log("load payment data", event.detail);
  }

  setPaymentMode($event:any){
    console.log($event.target.value)
    this.newOrder.payment_channel = $event.target.value
  }

  storeTransactionResponse(reference:string,response:any,order_public_id:string){
    this.orderService.storeTransactionResponse(reference,response,order_public_id).pipe(take(1)).subscribe()
  }

  computeAgreedtotal(){
    this.newOrder.agreed_price = this.newOrder.order_units * this.newOrder.unit_price
    const units:any = document.querySelector('.units')
    const agreed_price:any = document.querySelector('.agreedtotal')
    units.value = this.newOrder.order_units
    agreed_price.value = this.newOrder.agreed_price
  }

  private getOrderMetadata(){
    this.newOrder.escrow_fee = this.escrowfee
    const paymentchannels:any = document.querySelectorAll('.paymentchannel')
    paymentchannels.forEach((paymentchannel:any)=>{
      if(paymentchannel.checked){
        this.newOrder.payment_channel = paymentchannel.value
      }
    })
    
  }

  public selectFiles(e:any): void {
    const formData: any = new FormData();
    this.selectedFiles = e.target.files;
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      formData.append('file', file);
      console.log(formData.entries())
    }
  }

  initiatePayment(amount:number,email:string,order_public_id:string) {
    console.log(amount,email)
    return new Promise((resolve,reject)=>{
      this.paystackService.initiatePayment(amount, email, (response) => {
        console.log('--------->',order_public_id)
        if (response.status === 'success') {
          // Payment was successful, verify the transaction
          resolve(this.verifyTransaction(response.reference,order_public_id));
        } else {
          // Payment was not successful
          reject(this.verifyTransaction(response.reference,order_public_id));
        }
      });
    })
  }

  verifyTransaction(reference: string,order_public_id:string) {
    this.paystackService.verifyTransaction(reference, (response) => {
      // Handle the transaction verification callback
      self.paymentSuccess =  response.data.status == 'success'
      console.log(response)
      self.storeTransactionResponse(reference,response,order_public_id)
    });
    return this.paymentSuccess
  }
}
