import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CableElectricityService {

  constructor(private http: HttpClient) { }

  getCableNetworks(){
    return this.http.get<any>(`${environment.api}/getcabletvproviders`)
  }

  getCabletvBouquets(id:string){
    return this.http.get<any>(`${environment.api}/getcabletvbouquets?id=${id}`)
  }

  vendCableSubscription(payload:any){
    console.log("Vending Cable Subscription")
    return this.http.post<any>(`${environment.api}/purchase/cable`,payload)
  }

}
