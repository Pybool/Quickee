import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaystackService } from 'src/app/services/paystack.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

var self:any;

@Component({
  selector: 'app-become-vendor',
  templateUrl: './become-vendor.component.html',
  styleUrls: ['./become-vendor.component.css']
})
export class BecomeVendorComponent {
  footer:any ;
  email:string = '';
  subscription_type:any
  constructor(private paystackService:PaystackService,private authService: AuthService, private userService: UserService){}

  ngOnInit(){
    self = this
    let user:any = this.authService.retrieveUser()
    this.email = user.email
    this.subscription_type = user.subscription_type
  }

  ngAfterViewInit(){
    this.footer = document.querySelector("footer")
    this.footer.style.display = 'none';
    setTimeout(()=>{
      const trigger:any = document.querySelector("#become-vendor-modal")
      trigger?.click()
    },300)
  }

  becomeVendor(plan:any){
    console.log(plan)
    const env:any = environment
    const amount:any = env.BECOME_VENDOR_PLANS[plan]
    this.initiatePayment(parseInt(amount),plan)
  }

  initiatePayment(amount:number,plan:string) {
    return new Promise((resolve,reject)=>{
      this.paystackService.initiatePayment(amount, this.email, (response) => {
  
        if (response.status === 'success') {
          // Payment was successful, verify the transaction
          console.log("Payment was successfull")
          resolve(this.verifyTransaction(response.reference,plan));
        } else {
          // Payment was not successful
          reject(console.log('Payment failed.'));
        }
      });
    })
  }

  verifyTransaction(reference: string,plan:string) {
    this.paystackService.verifyTransaction(reference, (response) => {
      // Handle the transaction verification callback
      self.paymentSuccess =  response.data.status == 'success'
      self.storeTransactionResponse(reference,response,plan)
    });
    return 
  }

  storeTransactionResponse(reference:string,response:any,plan:string){
    this.userService.storeTransactionResponse(reference,response,plan).pipe(take(1)).subscribe((response:any)=>{
      if(response.status){
        const user = this.authService.retrieveUser()
        user.is_vendor = true;
        console.log(user)
        this.authService.storeUser(user)
        this.authService.setVendorSubscription(true)
        console.log(user)
        
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: `Success!`,
          text:response.message,
          showConfirmButton: false,
          timer: 1500
        })

        this.authService.navigateToUrl('merchant-orders')
        
      }
      else{
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: `Success!`,
          text:response.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  ngOnDestroy(){
    this.footer.style.display = 'block';
  }

}
