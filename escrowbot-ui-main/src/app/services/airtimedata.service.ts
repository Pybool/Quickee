import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenstorageService } from './tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AirtimedataService {

  public sellerjoined:any = {};
  public sellerfulfilled:any ={};
  constructor(private http:HttpClient, private tokenstorageservice: TokenstorageService) { }

  public airtime_purchase(data:any): Observable<any> {
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post("http://127.0.0.1:8000/api/v1/purchase/airtime", {data
    }, httpOptions_jointrx);
  };


  public data_subscription(data:any): Observable<any>{

    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post("http://127.0.0.1:8000/api/v1/purchase/data", {data
    }, httpOptions_jointrx);
  };

  
  public getairtimehistory(uid:string,search_by:string,params:any,chunk_size:any): Observable<any>{
    const httpOptions_gethistory = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getairtimehistory/${uid}/${search_by}/${params}/${chunk_size}`, httpOptions_gethistory);
  }


  public getdatasubscriptionhistory(uid:string,search_by:string,params:any,chunk_size:any): Observable<any>{
    const httpOptions_gethistory = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get(`http://127.0.0.1:8000/api/v1/getdatahistory/${uid}/${search_by}/${params}/${chunk_size}`, httpOptions_gethistory);
  }


}