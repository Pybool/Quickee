import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: any = {};
  showSpinner = false

  constructor(private authService: AuthService) { }

  ngAfterViewInit(){
    setTimeout(()=>{
      const pm:any = document.querySelector("#payment-modal")
      pm.click()
    },200)
  }

  login() {
    this.showSpinner = true;
    this.authService.login(this.credentials).pipe(take(1))
    .subscribe(
      (response:any) => {
        // Handle successful registration
        const token = response.token;
        const username = response.username;
        this.authService.storeToken(token);
        this.authService.storeUser({username:username,
                                    uid:response.uid,
                                    email:this.credentials.email,
                                    two_fa:response.two_fa,
                                    is_vendor:response.is_vendor,
                                    subscription_type:response.subscription_type});
        this.authService.navigateToUrl('orders')
        this.authService.setLoggedIn(response.status)
        this.showSpinner = false;
        Swal.fire({
          position: 'top-start',
          icon: 'success',
          title: `Success!`,
          text:`Your authentication was successful!`,
          showConfirmButton: false,
          timer: 1500
        })
      },
      (error) => {
        // Handle registration error
        this.showSpinner = false;
        Swal.fire({
          position: 'top-start',
          icon: 'error',
          title: `Authentication Failed!`,
          text:`${error?.error.error || 'Server is not reachable'}!`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    );
  }
}