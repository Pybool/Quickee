import { Component } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).{8,}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {};
  showSpinner:boolean = false;
  banks:string[] = [  "Access Bank",  "Fidelity Bank",  "Guranteed Trust Bank",  "United Bank for Africa",  "Zenith Bank"]
  
  constructor(private authService: AuthService) { }

  ngAfterViewInit(){
    setTimeout(()=>{
      const pm:any = document.querySelector("#payment-modal")
      pm.click()
    },200)
  }

  requirederrors(field:any){
    try{
      if(this.user[field].length == 0){
        return true;
      }
      return false;
    }
    catch(err){console.log(err);return false}
  }

  isInvalidAccountNo(){
    try{
      if(this.user.accountno.length > 0){
        if(this.user.accountno.length < 9){
          return true;
        }
        return false
      }
      return
      
    }
    catch(err){console.log(err);return false}
  }

  isInvalidBankName(){
    try{
      if(!this.banks.includes(this.user.bankname.trim())){
          return true;
      }
      return false
      
    }
    catch{return false}
  }

  isInvalidPassword(){
    try{
      if(this.user.password.trim().length > 0){
        if (!passwordPattern.test(this.user.password)) {
          return true;
        } else {
          return false;
        }
      }
      return
    }
    catch{return false}
  }

  isPasswordMatch(){
    try{
      if(this.user.passwordagain != this.user.password){
        console.log(true)
        return true;
      }
      return false;
    }
    catch{return false}
  }

  validerrors(field:any){
    return false;
  }

  isInvalidEmail() {
    try{
      if(this.user.email.trim().length > 0){
        if (!emailRegex.test(this.user.email)) {
          return true;
        } else {
          return false;
        }
      }
      return
    }
    catch{return false}
    
  }

  register() {
    if(this.user.password != this.user.passwordagain){
      Swal.fire({
        position: 'top-start',
        icon: 'error',
        title: `Password error!`,
        text:`Passwords do not match!`,
        showConfirmButton: false,
        timer: 1500
      })
      return
    }
    
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