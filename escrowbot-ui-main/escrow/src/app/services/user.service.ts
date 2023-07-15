import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  activeMerchant:any;
  activeMerchant$:any = new BehaviorSubject({})
  constructor(private http: HttpClient) { }

  setActiveMerchant(data:any){
    this.activeMerchant = data
    this.activeMerchant$.next(data)
  }

  getActiveMerchant(){
    return this.activeMerchant$.asObservable()
  }

  saveprofile(payload:any){
    return this.http.put<any>(`${environment.api}/profile`,payload)
  }

  userExists(payload:any){
    return this.http.post<any>(`${environment.api}/user-exists`,payload)
  }

  storeTransactionResponse(reference:string,transaction:any,plan:string){
    return this.http.post<any>(`${environment.api}/become-vendor-transactions`,{reference:reference,transaction:transaction,plan:plan})
  }

  enableOTP(transaction_pin_enabled:any){
    return this.http.post<any>(`${environment.api}/profile`,{transaction_pin_enabled:transaction_pin_enabled})
    
  }

  sendOTP(){
    return this.http.get<any>(`${environment.api}/send_otp`)
  }

  verifyVendorPaymentOTP(payload:any){
    return this.http.put<any>(`${environment.api}/send_otp`,payload)
  }

  getprofile(){
    return this.http.get<any>(`${environment.api}/profile`)
  }

  getMerchantProfile(merchantemail:string){
    return this.http.get<any>(`${environment.api}/merchant-profile?merchant=${merchantemail}`)
  }
}
