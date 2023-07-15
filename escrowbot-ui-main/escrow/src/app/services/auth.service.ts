import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenKey:string = 'token'
  userKey:string = 'user'
  loggedIn:boolean = false;
  loggedIn$:any = new BehaviorSubject(false)
  vendorSubscription:boolean = false
  vendorSubscription$:any = new BehaviorSubject(false)
  constructor(private http: HttpClient,private router:Router) { }

  setVendorSubscription(status:boolean){
    this.vendorSubscription = status
    this.vendorSubscription$.next(this.vendorSubscription)
  }

  getVendorSubscription(){
    return this.vendorSubscription$.asObservable()
  }

  setLoggedIn(status:boolean){
    this.loggedIn = status
    this.loggedIn$.next(this.loggedIn)
  }

  getAuthStatus(){
    return this.loggedIn$.asObservable()
  }

  login(credentials: any) {
    return this.http.post(`${environment.api}/login`, credentials);
  }

  register(user: any) {
    console.log(user)
    return this.http.post(`${environment.api}/register`, user);
  }

  storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  retrieveToken() {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  storeUser(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  retrieveUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  refresh(){
    return of([])
  }

  navigateToUrl(url:string){
    this.router.navigateByUrl(url)
  }
}