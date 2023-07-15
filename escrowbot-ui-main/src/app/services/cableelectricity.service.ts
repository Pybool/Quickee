import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenstorageService } from './tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class CableelectricityService {

  public sellerjoined:any = {};
  public sellerfulfilled:any ={};
  constructor(private http:HttpClient, private tokenstorageservice: TokenstorageService) { }

  public verify_customer(): Observable<any> {
    
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer '+ this.tokenstorageservice.getToken() })
    };

    return this.http.get("http://localhost:3000/api/transaction/seller_join?transaction_mode=order.table", httpOptions_jointrx);
  };


  public cable_subscription(data:any): Observable<any> {
    
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    // console.log("The published reservation ",reservation)
    console.log("Cable subscriptions ",data,this.tokenstorageservice.getToken())
    return this.http.post("http://localhost:8000/api/v1/purchase/cable_subscription", {data
    }, httpOptions_jointrx);
  };


  public electricity_subscription(data:any): Observable<any>{

    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    // console.log("The published reservation ",reservation)
    console.log("Electricity subscriptions ",data,this.tokenstorageservice.getToken())
    return this.http.post("http://localhost:8000/api/v1/purchase/electricity_purchase", {data
    }, httpOptions_jointrx);
  };

  public getelectricitypurchasehistory(uid:string,search_by:string,params:any,chunk_size:any): Observable<any>{
    console.log("Get electricity history")
    const httpOptions_gethistory = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    return this.http.get(`http://127.0.0.1:8000/api/v1/getelectricityhistory/${uid}/${search_by}/${params}/${chunk_size}`, httpOptions_gethistory);
  }

  public getcablesubscriptionhistory(uid:string,search_by:string,params:any,chunk_size:any): Observable<any>{
    console.log("Get cable history")
    const httpOptions_gethistory = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    return this.http.get(`http://127.0.0.1:8000/api/v1/getcablehistory/${uid}/${search_by}/${params}/${chunk_size}`, httpOptions_gethistory);
  }


  public validate_recipient(servicetype:any, payload:any){
    console.log("=======================================>", servicetype)
    const httpOptions_gen_token = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    let username = 'Genisys%20smartsolutions'
    let api_password= '10111011QWEqwe' 
    if (servicetype=="cable"){
      let tv_provider = payload.tv_provider.split(",")[0].toLowerCase()
      let bouquet = payload.bouquet.split("$")[0].toLowerCase()
      // console.log("The published reservation ",reservation)
      console.log("Transaction code fucked", `https://vtu.ng/wp-json/api/v1/verify-customer?username=${username}&password=${api_password}&customer_id=${payload.iuc_no}&service_id=${tv_provider}&variation_id=${bouquet}`)
      return this.http.get(`https://vtu.ng/wp-json/api/v1/verify-customer?username=${username}&password=${api_password}&customer_id=${payload.iuc_no}&service_id=${tv_provider}&variation_id=${bouquet}`, httpOptions_gen_token);

    }

    else if (servicetype=="electricity"){
      let disco = payload.disco.split(",")[1].toLowerCase()
      let meter_type = payload.meter_type.split("$")[0].toLowerCase()
      // console.log("The published reservation ",reservation)
      console.log("Transaction code fucked", `https://vtu.ng/wp-json/api/v1/verify-customer?username=${username}&password=${api_password}&customer_id=${payload.meter_no}&service_id=${disco}&variation_id=${meter_type}`)
      return this.http.get(`https://vtu.ng/wp-json/api/v1/verify-customer?username=${username}&password=${api_password}&customer_id=${payload.meter_no}&service_id=${disco}&variation_id=${meter_type}`, httpOptions_gen_token);

    }
    return null

    // https://vtu.ng/wp-json/api/v1/verify-customer?username=Genisys%20smartsolutions&password=10111011QWEqwe&customer_id=62418234034&service_id=ikeja-electric&variation_id=prepaid
    // http://vtu.ng/wp-json/api/v1/verify-customer?username=Genisys%20smartsolutions&password=10111011QWEqwe&customer_id=00456274757&service_id=eko-electric&variation_id=prepaid
  }

  public getcablesubscriptionmetrics(uid:string,search_by:string,params:any,chunk_size:any): Observable<any>{
    console.log("Get cable history")
    const httpOptions_gethistory = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    return this.http.get(`http://127.0.0.1:8000/api/v1/getcablehistory/${uid}/${search_by}/${params}/${chunk_size}`, httpOptions_gethistory);
  }

}