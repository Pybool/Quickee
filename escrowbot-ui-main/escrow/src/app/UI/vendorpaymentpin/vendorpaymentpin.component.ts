import { Component, Input } from '@angular/core';
import { take } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendorpaymentpin',
  templateUrl: './vendorpaymentpin.component.html',
  styleUrls: ['./vendorpaymentpin.component.css']
})
export class VendorpaymentpinComponent {

  user:any = {}
  order_public_id:any;
  constructor(private userService: UserService, private orderService: OrderService){}

  ngOnInit(){
    
  }

  payVendor(){
    this.orderService.getOrderId().pipe(take(2)).subscribe((order_public_id:any)=>{
      this.order_public_id = order_public_id
    })

    const data = {otp_code:this.user.otp,order_public_id:this.order_public_id}
    console.log("Order id ", this.order_public_id)
    this.userService.verifyVendorPaymentOTP(data).subscribe((response:any)=>{
      if(response.status){
        const close:any = document.getElementById('close')
        close.click()
        this.removePaymentButton(this.order_public_id)
        Swal.fire({
          position: 'top-start',
            icon: 'success',
            title: `Approved Settlement!`,
            text:response.message,
            showConfirmButton: false,
            timer: 1500
        })
      }
      else{
        Swal.fire({
          position: 'top-start',
            icon: 'error',
            title: `Approved Settlement!`,
            text:response.message,
            showConfirmButton: false,
            timer: 1500
        })
      }
      
    },
    
    (error) => {
      // Handle registration error
      Swal.fire({
        position: 'top-start',
          icon: 'error',
          title: `Error Occured!`,
          text:`Something went wrong!`,
          showConfirmButton: false,
          timer: 1500
      })
    })
  }
  
  private removePaymentButton(order_public_id:any){

    const pB:any = document.getElementById(order_public_id)
    console.log('PB_------> ', pB)
    pB.style.color = 'white'
    pB.id = 'rm'
    pB.innerHTML = 'Vendor Paid'
    pB.classList.remove('btn-outline-success')
    pB.classList.add('btn-outline-default')
    pB.setAttribute('disabled','')

  }
}
