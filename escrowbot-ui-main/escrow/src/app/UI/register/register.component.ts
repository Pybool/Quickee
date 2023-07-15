import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {};
  showSpinner:boolean = false;

  constructor(private authService: AuthService) { }

  ngAfterViewInit(){
    setTimeout(()=>{
      const pm:any = document.querySelector("#payment-modal")
      pm.click()
    },200)
  }

  register() {
    this.showSpinner = true
    this.authService.register(this.user).pipe(take(1))
      .subscribe(
        (response:any) => {
          // Handle successful registration
          this.showSpinner =false
          Swal.fire({
            position: 'top-start',
            icon: 'success',
            title: `Success!`,
            text:`Your registration was successful!`,
            showConfirmButton: false,
            timer: 1500
          })
          
          setTimeout(()=>{
            this.authService.navigateToUrl('login')
          },2000)
        },
        (error) => {
          // Handle registration error
          this.showSpinner = false
          Swal.fire({
            position: 'top-start',
            icon: 'error',
            title: `Failed!`,
            text:`${error?.error.error || 'Server is not reachable'}!`,
            showConfirmButton: false,
            timer: 1500
          })
        }
      );
  }
}