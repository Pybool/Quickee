
import { Component, OnDestroy } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merchantorderlist',
  templateUrl: './merchantorderlist.component.html',
  styleUrls: ['./merchantorderlist.component.css']
})
export class MerchantorderlistComponent implements OnDestroy {
  orders:any[] = [{}]
  showmerchantprofile:boolean = false
  showSpinner:boolean = false
  showSearchSpinner:boolean = false
  Object = Object
  listMode:boolean = true;
  total_count:number = 0
  is_search:boolean = false

  constructor(private orderService: OrderService, 
              private userService: UserService ,
              private authService:AuthService,
              private paginationService:PaginationService){}

  ngOnInit(){
    this.showSpinner = true;
    this.orderService.getMerchantOrders().pipe(take(1)).subscribe((response)=>{
      if(response.status){
        this.paginationService.setLinks(response.next,response.last,'seller-orders','',this.is_search)
        this.orders = response.data
        this.total_count = response.count
        this.is_search = false;
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
    this.pagianteSubscription()
    
  }

  pagianteSubscription(){
    this.paginationService.dataEvent.subscribe((response: any) => {
      // Here you can access the emitted data
      console.log('Received data:', response.data);
      if(response.status){
        this.paginationService.setLinks(response.next,response.last,'seller-orders',response.query,this.is_search)
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
    });
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
            text:`Could not find vendor!`,
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
          text:`Could not find vendor!`,
          showConfirmButton: false,
          timer: 1500
      })
    })
  }

  doAction($event:any){
    const data = {status:$event.target.value,order_public_id:$event.target.id}
    this.orderService.markMerchantOrders(data).pipe(take(1)).subscribe((response:any)=>{
      if(response.status){
        this.styleDropDown($event)
        Swal.fire({
          position: 'top-start',
            icon: 'success',
            title: `Marking Success!`,
            text:response.message,
            showConfirmButton: false,
            timer: 1500
        })
      }
      else{
        this.revertdropdownState($event)
        Swal.fire({
          position: 'top-start',
            icon: 'info',
            title: 'Marking failure!',
            text:response.message,
            showConfirmButton: false,
            timer: 1500
        })
      }
    },
    
    (error:any) => {
      this.revertdropdownState($event)
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

  private styleDropDown($event:any){
    if($event.target.value=='completed'){
      $event.target.classList.remove('processing')
      $event.target.classList.add('completed')
    }
    else if($event.target.value=='processing'){
      $event.target.classList.remove('completed')
      $event.target.classList.add('processing')
    }
  }

  private revertdropdownState($event:any){
    const order_public_id:string = $event?.target.id
    const orderObj:any = this.orders.find(x => x.order_public_id === order_public_id);
    $event.target.value = orderObj['status']
  }

  showReport(order:any){
    alert(`Report Details: \n\n${order.complaints}`)
  }

  public searchVendorList($event:any,filter:boolean=false){
    this.showSearchSpinner = true;
    this.orderService.searchVendorOrders($event.target.value,filter).pipe(take(1)).subscribe((response)=>{
      localStorage.removeItem('pageidx')
      if(response.status){
        this.is_search = true;
        this.paginationService.setLinks(response.next,response.last,'seller-orders',response.query,this.is_search)
        this.orders = response.data
        this.total_count = response.count
        // Swal.fire({
        //   position: 'top-start',
        //     icon: 'success',
        //     title: `Vendor Orders fetched!`,
        //     text:`Search results were found!`,
        //     showConfirmButton: false,
        //     timer: 1500
        // })
      }
      else{
        this.orders = []
        Swal.fire({
          position: 'top-start',
            icon: 'error',
            title: `Orders not fetched!`,
            text:`No search result was found!`,
            showConfirmButton: false,
            timer: 1500
        })
      }
      this.showSearchSpinner = false;
    },
    (error) => {
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

  formatDate(dateString:string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }


  toggleAccordion(id:string){
    const accordion:any = document.querySelector(`#${id}`)
    accordion.classList.toggle('collapse')
  }

  ngOnDestroy(){
    this.paginationService.setLinks(null,null,'seller-orders')
  }
}
