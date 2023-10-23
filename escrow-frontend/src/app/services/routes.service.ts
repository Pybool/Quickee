import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(public http: HttpClient) { }


  public getNetworks(): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/getnetworkproviders`);
  }
  
  public getDataSubscription(uid:number): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/getdatasubscription/${uid}`);
  }
  
  public getCableProviders(): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/getcabletvproviders`);
  }
  
  public getCabletvBouquets(uid:number): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/getcabletvbouquets/${uid}`);
  }
  
  public getElectrictyDiscos(): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/getelectricitydiscos`);
  }
  
  public verifyPayment(reference:any,orderRef:any,cart_reference:any): Observable<any>{
    let body = JSON.stringify({reference:reference,orderRef:orderRef,cart_reference:cart_reference})
    try{
       return this.http.post("http://localhost:8000/api/v1/payment/verify",{body})
    }
    catch(err:any){
      return this.http.post("http://localhost:8000/api/v1/payment/verify",{body})
    }
  }

  public getPlans(service:string): Observable<any>{
   
    return this.http.get(`http://127.0.0.1:8000/api/v1/periodicplans?service=${service}`);
  }

  public newCustomer(data:any): Observable<any>{
    return this.http.post(`http://127.0.0.1:8000/api/v1/customers`,data);
  }

  public getCustomers(): Observable<any>{
    return this.http.get(`http://127.0.0.1:8000/api/v1/customers`);
  }
  
}





