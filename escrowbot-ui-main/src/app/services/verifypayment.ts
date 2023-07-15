
import { Injectable } from '@angular/core';
import { TokenstorageService } from '../services/tokenstorage.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';



export class VerifyPayment{
    constructor(private http:HttpClient){}
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

}
