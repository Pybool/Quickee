import { ResolvependingService } from './../services/resolvepending.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './../app.state';
import { PendingOrders } from './../interfaces';
import { LocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AirtimeComponent } from '../airtime/airtime.component';
import { TokenstorageService } from './../services/tokenstorage.service';
import { Component, OnInit, OnDestroy,HostListener } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';



// $(window).on('popstate', function(event) {
//   alert("pop");
//  });

@Component({
            selector: 'app-resolve-pending',
            templateUrl: './resolve-pending.component.html',
            styleUrls: ['./resolve-pending.component.css']
})

export class ResolvePendingComponent implements OnInit, OnDestroy{

  public metadata:any;
  public pendingOrders!:any;
  public timestamp:any;
  public allowedroutes:string[] = []
  public Metadata:any = []
  public subs:any
  constructor(private router: Router, private http: HttpClient, private airtimecomponent: AirtimeComponent, private store: Store<AppState>, private tokenstorageservice: TokenstorageService,
  private location: LocationStrategy, private resolvepending: ResolvependingService, private alertcomponent: AlertComponent) { 
  
    this.location.onPopState(() => {
      // history.pushState(null, null, window.location.href);
      let redirect:any = window.sessionStorage.getItem("ResolvePending")
      redirect = JSON.parse(redirect)
      this.router.navigateByUrl(`/${redirect.service}`);
      this.subs.unsubscribe()
    });  
  }
   ngAfterViewInit(): void{
    // alert()
    
  
   }

  ngOnInit(): void { 
    
    this.pendingOrders = this.store.select(state => state.pendingOrders)
    // alert(this.pendingOrders)
    this.subs = this.pendingOrders.subscribe({ // Gets all pending  orders and push the order_id's into the allowed routes array
        next:(pendingOrders:any) => {
          // console.log("Fetched from store ", pendingOrders[0].order_id, Object.keys(pendingOrders))
          console.log(10,pendingOrders)
          if (pendingOrders.length >= 1 || this.allowedroutes.length >= 1){
          console.log(20)

            console.log("Fetched from store ", pendingOrders[0].order_id, Object.keys(pendingOrders))
            this.timestamp =  Math.floor(Date.now()/1000)
            console.log("I am the caller 1")
            this.pendingOrdersHandler(pendingOrders[0].order_id)

          }

          else if(this.tokenstorageservice.getState() !== null){
            
            let sessionstorage_pendingorders:any = this.tokenstorageservice.getState()
            console.log("I am the caller 2 ", sessionstorage_pendingorders.pendingOrders[0].order_id)
            this.pendingOrdersHandler(sessionstorage_pendingorders.pendingOrders[0].order_id)
          }

        }
     })
      
   }

  public resolvePendingOrder(value: any | null){
      console.log("Value from button ",value, {order_id:value[0],order_type:value[1],mode:value[2],api_provider:value[3]})
      this.resolvepending.resolve_pending({order_id:value[0],order_type:value[1],mode:value[2],api_provider:value[3]}).subscribe({ // Gets all pending  orders and push the order_id's into the allowed routes array
        next:(resolvependingresponse:any) => { 
            console.log(resolvependingresponse)
            this.alertcomponent.showalert(`${resolvependingresponse.message}`)
         } 
      
      })
  }
  private async pendingOrdersHandler(pendingOrders:any[]){

          this.allowedroutes = pendingOrders
          const route = this.router.url
          let path:any = /[^/]*$/
          path = path.exec(route)[0].trim();
          console.log("[Pending order path =========>] ", path)
          if (!this.allowedroutes.includes(path)){ // If a user manually enters a route not present in the allowedRoutes array, return a 404 error page
             this.router.navigate(["**"]);
            // alert("Route was not found")
          }
          else{
            var index = this.allowedroutes.indexOf(""+path); //Get the index of the manually entered path from browser and find the index of the path in the payload
            // console.log("Meta data ", history.state.data.metadata)
            // this.Metadata.push[history.state.data.metadata]
            // console.log("Metadata ", this.Metadata)
            
            // this.Metadata = history.state.data.metadata
            // console.log("9000",this.Metadata.length )
            // if (this.Metadata.length == 0){
            //   const metadata_obj:any = window.sessionStorage.getItem("ResolvePending"); // Load the reservationEntity into the page.

            //   this.Metadata = JSON.parse(metadata_obj)
            // }

            const history:any = await this.tokenstorageservice.getHistory()
            console.log("History ",history[''+path])
            this.Metadata = history[''+path]
          }
        
  }
  @HostListener('unloaded')
  ngOnDestroy(){
    // delete this.allowedroutes?
    // alert("I was destroyed")
    // this.router.navigateByUrl('/airtime')
    // let redirect:any = window.sessionStorage.getItem("ResolvePending")
    // redirect = JSON.parse(redirect)
    // this.router.navigateByUrl(`/${redirect.service}`);
    // this.subs.unsubscribe()
    
  }
    
}
