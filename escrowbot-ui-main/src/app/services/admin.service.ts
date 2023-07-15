import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TokenstorageService } from './tokenstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public cachedMetadata$: Observable<any[]>;

  constructor(private http:HttpClient, private tokenstorageservice: TokenstorageService) { }

  public admin_pricelist_metadata(): Observable<any> {
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    if (!this.cachedMetadata$) {
      this.cachedMetadata$ =  this.http.get(`http://127.0.0.1:8000/api/v1/pricelist_metadata/`, httpOptions_jointrx).pipe(
        map((response: any) => response),shareReplay(1)
      );
    }
    
    return this.cachedMetadata$
  };

  public admin_pricelist(data:any): Observable<any> {
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
  
    return this.http.get(`http://127.0.0.1:8000/api/v1/pricelist/${data.service}/${data.api_provider}/${data.service_provider}`, httpOptions_jointrx).pipe(
      map((response: any) => response),shareReplay(1)
    );
    
  };


  
}
