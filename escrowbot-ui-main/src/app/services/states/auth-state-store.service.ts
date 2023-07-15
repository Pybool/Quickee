import { authroute } from './../../routes/app.routes';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const AUTH_API = authroute;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class AuthStore{
    private subject = new BehaviorSubject<any>(null);

    user$:Observable<any> =  this.subject.asObservable();
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    isAdmin$: Observable<boolean>;

    constructor(private http: HttpClient,private router: Router,){
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    }

    public login(email: string, password: string): Observable<any> {
        return this.http.post(AUTH_API.login, {
          email,
          password
        }, httpOptions).pipe(tap(user => {this.subject.next(user);console.log("User ====> ",user)}),shareReplay());
      }

    public logout(){
        this.subject.next(null); 
    }
}