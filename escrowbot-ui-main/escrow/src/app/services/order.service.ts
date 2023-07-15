import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  clientSecret:string = ''
  paymentIntent$:any = new BehaviorSubject('')

  OrderId:any
  OrderId$ = new BehaviorSubject('')

  constructor(private http: HttpClient) { }

  setClientSecret(secret:string){
    this.clientSecret = secret
    this.paymentIntent$.next(this.clientSecret)
  }

  getClientSecret(){
    return this.paymentIntent$.asObservable()
  }

  setOrderId(order_public_id:string){
    this.OrderId = order_public_id
    this.OrderId$.next(this.OrderId)
  }

  nextPage(link:number,cmp:string){
    if(cmp == 'seller-orders'){
      return this.http.get<any>(`${environment.api}/merchant-orders?limit=${10}&offset=${(link*10) + 1}"`) 
    }
    else{
      return this.http.get<any>(`${environment.api}/orders?limit=${10}&offset=${(link*10) + 1}"`) 
    }
  }

  getOrderId(){
    return this.OrderId$.asObservable()
  }

  reportOnOrder(payload:any){
    return this.http.put<any>(`${environment.api}/report-vendor-order`,payload)
  }

  getMetaData(){
    return this.http.get<any>(`${environment.api}/orders-metadata`)
  }

  createOrder(payload:any){
    return this.http.post<any>(`${environment.api}/orders`,payload)
  }

  getOrders(){
    return this.http.get<any>(`${environment.api}/orders`)
  }

  searchOrders(q:string,filter:boolean){
    return this.http.get<any>(`${environment.api}/orders?q=${q}&filter=${filter}`)
  }

  payVendor(payload:any){
    return this.http.put<any>(`${environment.api}/orders`,payload)
  }

  getMerchantOrders(){
    return this.http.get<any>(`${environment.api}/merchant-orders`)
  }

  searchVendorOrders(q:string,filter:boolean){
    return this.http.get<any>(`${environment.api}/merchant-orders?q=${q}&filter=${filter}`)
  }

  markMerchantOrders(payload:any){
    return this.http.put<any>(`${environment.api}/merchant-orders`,payload)
  }

  storeTransactionResponse(reference:string,transaction:any,order_public_id:string){
    return this.http.post<any>(`${environment.api}/transactions`,{reference:reference,transaction:transaction,order_public_id:order_public_id})
  }
}
