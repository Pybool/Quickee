import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenstorageService } from './tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private tokenstorageservice: TokenstorageService, public http: HttpClient) { }
  public getNetworks(): Observable<any>{
    const httpOptions_get_networks = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getnetworkproviders`, httpOptions_get_networks);
  }
  
  public getDataSubscription(uid:number): Observable<any>{
    const httpOptions_getdatasubs = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getdatasubscription/${uid}`, httpOptions_getdatasubs);
  }
  
  
  public getCableProviders(): Observable<any>{
    const httpOptions_get_networks = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getcabletvproviders`, httpOptions_get_networks);
  }
  
  public getCabletvBouquets(uid:number): Observable<any>{
    const httpOptions_getbouquets = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getcabletvbouquets/${uid}`, httpOptions_getbouquets);
  }
  
  public getElectrictyDiscos(): Observable<any>{
    const httpOptions_getdiscos = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getelectricitydiscos`, httpOptions_getdiscos);
  }
  
  public verifyPayment(reference:any,orderRef:any,cart_reference:any): Observable<any>{
    let body = JSON.stringify({reference:reference,orderRef:orderRef,cart_reference:cart_reference})
    const httpOptions_jointrx = {
              headers: new HttpHeaders({ 'Content-Type': 'application/json'})
            };
    console.log("The published reservation ", body)
  
    try{
       return this.http.post("http://localhost:8000/api/v1/payment/verify",{body}, httpOptions_jointrx)
    }
    catch(err:any){
      console.log(err,this.http)
      return this.http.post("http://localhost:8000/api/v1/payment/verify",{body}, httpOptions_jointrx)
      
    }
  }

  public getPlans(service:string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.get(`http://127.0.0.1:8000/api/v1/periodicplans?service=${service}`, httpOptions);
  }

  public newPlan(data:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.post(`http://127.0.0.1:8000/api/v1/periodicplans`,data, httpOptions);
  }

  public getServiceCustomers(service:string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.get(`http://127.0.0.1:8000/api/v1/periodic_subscribers?service=${service}`, httpOptions);
  }

  public newCustomer(data:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.post(`http://127.0.0.1:8000/api/v1/customers`,data, httpOptions);
  }

  public newSubscriber(data:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.post(`http://127.0.0.1:8000/api/v1/periodic_subscribers`,data, httpOptions);
  }

  public getCustomers(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.get(`http://127.0.0.1:8000/api/v1/customers`, httpOptions);
  }
  
  public newSubscription(args:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.post(`http://127.0.0.1:8000/api/v1/periodicsubscriber/create`,{uid:uidstr,data:args}, httpOptions);
  }

  public editSubscription(args:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken()})
    };
    let uidstr = this.tokenstorageservice.getUser()
    return this.http.post(`http://127.0.0.1:8000/api/v1/periodicsubscriber/edit`,{uid:uidstr,data:args}, httpOptions);
  }
  
}





