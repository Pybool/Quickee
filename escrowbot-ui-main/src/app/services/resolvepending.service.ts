import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenstorageService } from './tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ResolvependingService {

  constructor(private http:HttpClient, private tokenstorageservice: TokenstorageService) { }

  public resolve_pending(order_data:any): Observable<any> {
    order_data['uid'] = this.tokenstorageservice.getUser()
    const httpOptions_resolve = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

    return this.http.post("http://localhost:8000/api/v1/resolve/pending", {order_data}, httpOptions_resolve);
  };

}