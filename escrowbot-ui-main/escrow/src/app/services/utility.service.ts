import { RoutesService } from './routes.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';


export function titleCase(str:any) {
  str = str.toLowerCase() 
           .split(' ') 
           .map(function(word:string) {
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
 


  constructor(private routeservice: RoutesService) {}


  public getNetworks(): Observable<any>{return this.routeservice.getNetworks()}

  public getCableProviders(): Observable<any>{return this.routeservice.getCableProviders()}

  public getElectrictyDiscos(): Observable<any>{return this.routeservice.getElectrictyDiscos()}

  public getPlans(service:any): Observable<any>{return this.routeservice.getPlans(service)}

  public newCustomer(data:any): Observable<any>{return this.routeservice.newCustomer(data)}

  public getCustomers(): Observable<any>{return this.routeservice.getCustomers()}

  public getCabletvBouquets(uid:number): Observable<any>{return this.routeservice.getCabletvBouquets(uid)}

  public getDataSubscription(uid:number): Observable<any>{return this.routeservice.getDataSubscription(uid)}

  public verifyPayment(reference:any,orderRef:any,cart_reference:any): Observable<any>{return this.routeservice.verifyPayment(reference,orderRef,cart_reference)}


 
}