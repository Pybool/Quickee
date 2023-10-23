import { ChangeDetectorRef, Component , OnChanges} from '@angular/core';
import { INewOrder, NewOrder } from './createorder.model';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { take } from 'rxjs';
import { PaystackService } from 'src/app/services/paystack.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
// import { GooglePayButtonComponent } from '@google-pay/button-angular';

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
  total_payable = 0.00
  
  paymentRequest!:google.payments.api.PaymentDataRequest

  constructor(private orderService: OrderService, 
              private paystackService:PaystackService,
              private authService: AuthService,
              private userService: UserService,
              private router:Router,
              private cdr: ChangeDetectorRef){}

  ngOnInit(){
    this.newOrder.agreed_price = 0.00
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

  mailIsSame(){
    return this.newOrder.buyer_email === this.newOrder.seller_email
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
    let paybtn:any = ''
    setTimeout(()=>{
      paybtn = document.querySelector('.paybtn')
      try{
        if(self.newOrder.seller_email !=undefined && 
          self.newOrder.buyer_email !=undefined && 
          self.newOrder.order_units !=undefined &&
          self.newOrder.unit_price != undefined &&
          (self.newOrder.description != undefined || self.newOrder?.description?.trim() != '') &&
          self.newOrder?.description?.trim().length > 10
          ){
            if(!self.mailIsSame()){
              self.placeHolderActive = false;
              paybtn.style.opacity = '1'
            }
          }
          else{
            self.placeHolderActive = true;
            paybtn.style.opacity = '0.6'
          }
      }
      catch{}
      if(self.newOrder?.seller_email?.trim() == '' || self.nonExistentVendor){
        self.placeHolderActive = true;
        paybtn.style.opacity = '0.6'
      }
    },70)
    
  }

  private provideCustomerService(amount:number,email:string,paymentData:any={}){
    this.orderService
    .createOrder({'file':this.formData,'data':this.newOrder})
     .pipe(take(1)).subscribe((response)=>{
            
      if(response.status){
        this.startpayment = true
        this.ordercreated = true
        this.router.navigate(['/new-order'],{queryParams:{orderId:response.data}})

        if(this.newOrder.payment_channel == 'Debit Card'){
          this.initiatePayment(Math.round(amount),email,response.data).then((status)=>{
            if(this.ordercreated==true && status==true){
              Swal.fire({
                position: 'top-start',
                icon: 'success',
                title: `Order Created!`,
                text:`Your order has been placed and your payment verified!`,
                showConfirmButton: false,
                timer: 1500
              })
              this.ordercreated = false              
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

        else if(this.newOrder.payment_channel == 'Google Pay'){
          paymentData['status'] = true;
          console.log(paymentData?.reference,
          paymentData,
          response.data,
          true)

          this.storeTransactionResponse(
            paymentData?.reference,
            paymentData,
            response.data,
            true
            )
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


  payStackSubmit(){
    this.placeHolderActive = true
    this.validateEmail()
    const amount = parseFloat(this.newOrder.agreed_price) + this.escrowfee
    const email = this.newOrder.buyer_email

        if(this.emailRequiredError == false && this.emailInvalidError == false){
          this.getOrderMetadata()
          this.provideCustomerService(amount,email)
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
    const paymentData = (event as CustomEvent<google.payments.api.PaymentData>)?.detail;
    if(paymentData){
      console.log("load payment data", paymentData);
      const amount = parseFloat(this.newOrder.agreed_price) + this.escrowfee
      const email = this.newOrder.buyer_email
      this.provideCustomerService(amount, email,paymentData)
    }    
  }

  setPaymentMode($event:any){
    
    this.cdr.detectChanges()
    if($event.target.value == 'Debit Card'){
      this.newOrder.payment_channel = $event.target.value
      this.activatePayment()
      
    }

    else if($event.target.value == 'Google Pay' ){
      
      if (this.placeHolderActive == true){
        $event.target.checked = false
        return alert('You have not filled in the order form correctly')
      }
      this.newOrder.payment_channel = $event.target.value
      this.paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleGatewayMerchantId'
              }
            }
          }
        ],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'Demo Merchant'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: `${parseFloat(this.newOrder.agreed_price) + this.escrowfee}`,
          currencyCode: 'NGN',
          countryCode: 'NG'
        }
      }
      console.log(this.paymentRequest)
    }
  }

  storeTransactionResponse(reference:string,response:any,order_public_id:string,success:boolean){
    this.orderService.storeTransactionResponse(reference,response,order_public_id,success).pipe(take(1)).subscribe((response)=>{
      this.authService.navigateToUrl('orders')
    })
  }

  computeAgreedtotal(){
    this.newOrder.agreed_price = this.newOrder.order_units * this.newOrder.unit_price
    const units:any = document.querySelector('.units')
    const agreed_price:any = document.querySelector('.agreedtotal')
    units.value = this.newOrder.order_units
    agreed_price.value = this.newOrder.agreed_price
    // const totalfee:any = document.querySelector('.totalamount')
    const total = this.escrowfee + parseFloat(agreed_price.value)
    if(!isNaN(total)){
      // totalfee.value = total
      this.total_payable = total
    }
     
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
    }
  }

  initiatePayment(amount:number,email:string,order_public_id:string) {
    return new Promise((resolve,reject)=>{
      this.paystackService.initiatePayment(amount, email, (response) => {
        if (response.status === 'success') {
          resolve(this.verifyTransaction(response.reference,order_public_id));
        } else {
          reject(this.verifyTransaction(response.reference,order_public_id));
        }
      });
    })
  }

  verifyTransaction(reference: string,order_public_id:string) {
    this.paystackService.verifyTransaction(reference, (response) => {
      self.paymentSuccess =  response.data.status == 'success'
      self.storeTransactionResponse(reference,response,order_public_id,self.paymentSuccess)
    });
    return this.paymentSuccess
  }
}
