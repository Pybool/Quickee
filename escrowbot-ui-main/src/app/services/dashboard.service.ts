import { Injectable } from '@angular/core';
import { TokenstorageService } from '../services/tokenstorage.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class DashboardService {

  constructor(private tokenstorageservice: TokenstorageService, public http: HttpClient) { }

    public getRecentTransactions(uid:string,chunk_size:any): Observable<any>{
      console.log("Loading dashboard for user")
      const httpOptions_loadtransactions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})
      };
      return this.http.get(`http://127.0.0.1:8000/api/v1/getrecentTransactions/${uid}/${chunk_size}`, httpOptions_loadtransactions);
    }

    public getDashboardMetrics(uid:string,timeframe:any): Observable<any>{
      console.log("Loading dashboard for user")
      const httpOptions_loadmetrics = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'})
      };
      return this.http.get(`http://127.0.0.1:8000/api/v1/getusermetrics/${uid}/${timeframe}`, httpOptions_loadmetrics);
    }
}
