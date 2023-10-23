import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh = false;

  constructor(private authService: AuthService,private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    let req;
    console.log(request,this.authService?.retrieveToken())
    if(request.url.includes('external') == false){
        req = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.authService?.retrieveToken()}`
            }
          });
    }
    else{
        req = request
    }
    

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      console.log("status code error ===> ",err.status)
      if (err.status === 401 || err.status === 403 && !this.refresh) {
        this.refresh = true;
        return this.authService.refresh().pipe(
          
          switchMap((res: any) => {
            alert("Your session has expired, please re-login")
            // this.authService.getToken = res.token;
            this.router.navigate(['/login']);

            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.authService?.retrieveToken()}`
              }
            }));
          })
        );
      }
      this.refresh = false;
      return throwError(() => err);
    }));
  }
}
