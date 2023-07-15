import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Account } from './../_models/account';
import { BehaviorSubject, Observable } from 'rxjs';
import { authroute} from '../routes/app.routes';

const AUTH_API = authroute;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({providedIn: 'root'})
export class AuthService {
        private accountSubject: BehaviorSubject<Account >;
        public account: Observable<Account>;


        public baseUrl:any = ''
        constructor(private http: HttpClient,private router: Router,) 
        {
          this.accountSubject = new BehaviorSubject<Account | any> (null);
          this.account = this.accountSubject.asObservable();
      }
                  
        public gettoken(){

          const token = window.sessionStorage.getItem("TOKEN");
          console.log("token ",token)
          if (token) {
            console.log("token ",token)
            return token
            // return JSON.parse(token) 
          }
          else{
            return false;
          }
          // return token;
        }
        

        public resendmail(public_id: string): Observable<any> {
          return this.http.get(`http://localhost:3000/api/authentication/resend_mail?public_id=${public_id}`);
        }

        public register(account:Account): Observable<any> {
          console.log("The data ",account)
          let account_data:any = JSON.stringify(account)
          return this.http.post(AUTH_API.register, {account_data
          }, httpOptions);
        }

        public logout() {
          window.sessionStorage.clear();
          this.router.navigate(['/signin']);
      }

        public forgotPassword(email: string) {
            return this.http.post(`${this.baseUrl}/forgot-password`, { email });
        }

        public validateResetToken(token: string) {
            return this.http.post(`${this.baseUrl}/validate-reset-token`, { token });
        }

        public resetPassword(token: string, password: string, confirmPassword: string) {
            return this.http.post(`${this.baseUrl}/reset-password`, { token, password, confirmPassword });
        }

        // private refreshTokenTimeout:any;

        // private startRefreshTokenTimer() {
        //     // parse json object from base64 encoded jwt token
        //     const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        //     // set a timeout to refresh the token a minute before it expires
        //     const expires = new Date(jwtToken.exp * 1000);
        //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
        //     this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
        // }

        // private stopRefreshTokenTimer() {
        //     clearTimeout(this.refreshTokenTimeout);
        // }
}


