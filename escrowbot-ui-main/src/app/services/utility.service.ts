import { RoutesService } from './routes.service';
import { Injectable } from '@angular/core';
import { TokenstorageService } from '../services/tokenstorage.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Type } from '@angular/core';
import selectors from "./domselectors"

// import { CableperiodicsubscriptionComponent } from '../periodicsubscriptions/cableperiodicsubscription/cableperiodicsubscription.component';
var cable_id ;
var power_id;
var g_subscription;
var g_cablemessageSource;
var g_currentMessage;
var g_todisableElements;

export default function disableElementsAndChildren(e){
  try{
      if (g_todisableElements.includes(e)){

        var nodes:any = document.getElementById(e)
        // console.log("The nodes ",nodes)
          for(var i = 0; i < nodes.length; i++){
            var str = String(nodes[i])
            // console.log("The strings ", str)
            if (!str.includes('<options>')){nodes[i].disabled = true;}
        }
      }
  }
  catch(err){}
    
}

export function titleCase(str) {
  str = str.toLowerCase() 
           .split(' ') 
           .map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
   
});
 return str.join(' '); 
}

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  static verifyPayment: any;
  public cableloaded:string = 'false';
  public powerloaded:string = 'false';
  public cableintervalId:any;
  public powerintervalId:any;
  public todisableElements:any = []
  beast = "Lioness"
  cablesubscriptionMycomponent?: Type<any>
  public currentMessage:any;

  private cablemessageSource$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private routeservice: RoutesService) {
    g_cablemessageSource = this.cablemessageSource$
    this.currentMessage = g_cablemessageSource.asObservable();
    g_currentMessage = this.currentMessage
   }

   async changeMessage(message: string) {g_cablemessageSource.next(message)}

  getbeast(){
    return this.beast
  }

  getMessage() {return g_currentMessage}

  public getNetworks(): Observable<any>{return this.routeservice.getNetworks()}

  public getCableProviders(): Observable<any>{return this.routeservice.getCableProviders()}

  public getElectrictyDiscos(): Observable<any>{return this.routeservice.getElectrictyDiscos()}

  public newSubscription(args:any): Observable<any>{return this.routeservice.newSubscription(args)}

  public newPlan(data:any): Observable<any>{return this.routeservice.newPlan(data)}

  public getPlans(service): Observable<any>{return this.routeservice.getPlans(service)}

  public newCustomer(data:any): Observable<any>{return this.routeservice.newCustomer(data)}

  public newSubscriber(data:any): Observable<any>{return this.routeservice.newSubscriber(data)}

  public getCustomers(): Observable<any>{return this.routeservice.getCustomers()}

  public getServiceCustomers(service): Observable<any>{return this.routeservice.getServiceCustomers(service)}

  public editSubscription(args:any): Observable<any>{return this.routeservice.editSubscription(args)}

  public getCabletvBouquets(uid:number): Observable<any>{return this.routeservice.getCabletvBouquets(uid)}

  public getDataSubscription(uid:number): Observable<any>{return this.routeservice.getDataSubscription(uid)}

  public verifyPayment(reference:any,orderRef:any,cart_reference:any): Observable<any>{return this.routeservice.verifyPayment(reference,orderRef,cart_reference)}


 
}