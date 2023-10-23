import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirtimeDataService {

  constructor(private http: HttpClient) { }

  vendAirtime(payload:any){
    console.log("Vending airtime")
    return this.http.post<any>(`${environment.api}/purchase/airtime`,payload)
  }

  vendData(payload:any){
    console.log("Vending data")
    return this.http.post<any>(`${environment.api}/purchase/data`,payload)
  }

}
