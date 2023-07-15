import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.css']
})
export class OrderslistComponent implements OnDestroy {
  orders:any[] = [{}]
  showmerchantprofile:boolean = false
  showSpinner:boolean = false
  showSearchSpinner:boolean = false
  vendorPinModal:boolean = false
  reportVendorModal:boolean = false
  orderPublicId:string = ''
  Object = Object
  listMode:boolean = true;
  total_count:number = 0
  @Output() orderPublicIdChange:EventEmitter<any> =new EventEmitter<any>()

  constructor(private orderService: OrderService,
              private userService: UserService ,
              private authService:AuthService,
              private router:Router,
              private paginationService: PaginationService){}

  ngOnInit(){
    this.showSpinner = true;
    this.orderService.getOrders().pipe(take(1)).subscribe((response)=>{
      if(response.status){
        this.paginationService.setLinks(response.next,response.last,'buyer-orders')
        this.orders = response.data
        this.total_count = response.count
      }
      else{
        this.orders = []
        Swal.fire({
          position: 'top-start',
            icon: 'error',
            title: `Orders not fetched!`,
            text:`Your orders could not be fetched!`,
            showConfirmButton: false,
            timer: 1500
        })
      }
      this.showSpinner = false;
    },
    (error) => {
      // Handle registration error
      this.orders = []
      this.showSpinner = false;
      Swal.fire({
        position: 'top-start',
          icon: 'error',
          title: `Orders not fetched!`,
          text:`Your orders could not be fetched!`,
          showConfirmButton: false,
          timer: 1500
      })
    })
    
  }

  updateOrderPublicId(order_public_id:string) {
    this.orderPublicId = order_public_id;
    this.orderService.setOrderId(this.orderPublicId)
  }

  toggleListMode(){
    this.listMode = !this.listMode
  }

  receivePaginationData(response:any){
    // this.customers$ = of(response?.data) || []
  }

  loadMerchantProfile($event:any){
    const email = $event.target.id
    this.userService.getMerchantProfile(email).pipe(take(1)).subscribe((response)=>{
      if(response.status){
        this.userService.setActiveMerchant(response)
        // this.authService.navigateToUrl('merchantprofile')
        this.showmerchantprofile = true
      }
      else{
        Swal.fire({
          position: 'top-start',
            icon: 'error',
            title: `Not Found!`,
            text:`Could not find merchant!`,
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
          title: `Not Found!`,
          text:`Could not find merchant!`,
          showConfirmButton: false,
          timer: 1500
      })
    })
  }

  payVendor($event:any){
    const order_public_id = $event.target.id
    if(order_public_id == 'rm'){return}
    this.updateOrderPublicId(order_public_id)
    const should_pay = confirm(`Please ensure you have received value for your money before you pay any vendor.\n\nAre you sure you intend to pay this vendor ?`)
    if(!should_pay){return}
    const user = this.authService.retrieveUser()
    console.log(user, user?.two_fa)
    if(user?.two_fa){
      this.vendorPinModal = true
      setTimeout(()=>{
        const mdl:any = document.getElementById('vendor-pin-payment-modal')
        if(mdl){
          return mdl.click()
        }
      },500)
      this.senderPaymentOtp(order_public_id)
    }
    else{
      
      this.orderService.payVendor({order_public_id:order_public_id}).pipe(take(1)).subscribe((response)=>{
        if(response.status){
          this.removePaymentButton(order_public_id)
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
  }

  reportVendor($event:any){
    this.reportVendorModal = true
      setTimeout(()=>{
        const mdl:any = document.getElementById('report-vendor-modal')
        if(mdl){
          return mdl.click()
        }
      },500)
    console.log($event.target.id)
    this.router.navigate(['/orders'],{queryParams:{orderId:$event.target.id}})
  }

  searchOrder($event:any,filter:boolean=false){
    this.showSearchSpinner = true;
    this.orderService.searchOrders($event.target.value,filter).pipe(take(1)).subscribe((response)=>{
      if(response.status){
        this.paginationService.setLinks(response.next,response.last,'buyer-orders')
        this.orders = response.data
        Swal.fire({
          position: 'top-start',
            icon: 'success',
            title: `Orders fetched!`,
            text:`Search results were found!`,
            showConfirmButton: false,
            timer: 1500
        })
      }
      else{
        this.orders = []
        Swal.fire({
          position: 'top-start',
            icon: 'error',
            title: `Orders not fetched!`,
            text:`No result was found!`,
            showConfirmButton: false,
            timer: 1500
        })
      }
      this.showSearchSpinner = false;
    },
    (error) => {
      // Handle registration error
      this.orders = []
      this.showSearchSpinner = false;
      Swal.fire({
        position: 'top-start',
          icon: 'error',
          title: `Orders not fetched!`,
          text:`Something went wrong!`,
          showConfirmButton: false,
          timer: 1500
      })
    })
  }

  private removePaymentButton(order_public_id:string){
    const orderObj:any = this.orders.find(x => x.order_public_id === order_public_id);
    orderObj['is_buyer_approved'] = true;
  }

  private senderPaymentOtp(order_public_id:string){
    this.userService.sendOTP().subscribe()
  }

  toggleAccordion(id:string){
    const accordion:any = document.querySelector(`#${id}`)
    accordion.classList.toggle('collapse')
  }

  ngOnDestroy(){
    this.paginationService.setLinks(null,null,'buyer-orders')
  }

}
