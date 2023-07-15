import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnDestroy {
  viewMode = true;
  isReadOnly:boolean = true;
  userBasicInfoForm: FormGroup;
  userDetailsForm: FormGroup;
  username:string = 'N/A'
  vendorPinModal:boolean = false;
  showSpinner:boolean = true;

  constructor(private userService: UserService, private authService: AuthService) {
    this.userBasicInfoForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      othername:new FormControl('', Validators.required)
    });

    this.userDetailsForm = new FormGroup({
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      accountno: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      regdate: new FormControl(''),
      username: new FormControl('', Validators.email),
      transaction_pin_enabled:new FormControl('', Validators.email),
      // userOtherEmail: new FormControl('', Validators.email)
    });
  }

  private removeKeysFromObject(obj:any, keysToRemove:any[]) {
    for (let key of keysToRemove) {
      if (obj.hasOwnProperty(key)) {
        delete obj[key];
      }
    }
    return obj
  }
  


  ngOnInit(){

    this.userService.getprofile().pipe(take(1)).subscribe((response)=>{
      console.log(response)
      if(response.status){
        this.showSpinner = false;
      }
      this.username = response.data.username
      const profiledata = JSON.parse(JSON.stringify(response.data))
      const userDetails = this.removeKeysFromObject(profiledata,['firstname','surname','othername'])
      const basicInfo = this.removeKeysFromObject(response.data,['email','phone','accountno','bankname','country','regdate','username','transaction_pin_enabled'])
      this.userDetailsForm.setValue(userDetails);
      this.userBasicInfoForm.setValue(basicInfo);
    })
  }

  private setInputBorder(color:string,undo=false){
    const inputs:any = document.querySelectorAll('input')
    try{
      inputs.forEach((input:HTMLInputElement)=>{
        const input_parent:any = input.parentElement?.parentElement?.parentElement
        if(!undo){
          input_parent.style.borderBottom = '1.5px solid';
        }
        else{
          input_parent.style.borderBottom = '0px';
        }
        input_parent.style.borderBottomColor = color;
      })
    }
    catch{}
  }

  editprofile(save:string=''){
    this.isReadOnly = false
    this.setInputBorder('lightgreen')
    if(!this.username.includes('Editing')){
      this.username = this.username + ' ' + '[Editing]'
    }
    this.viewMode = !this.viewMode;
  }

  switchMode() {
    this.viewMode = !this.viewMode;
  }

  showVendorPinModal(){
    console.log('Modal')
    this.vendorPinModal = true
  }

  enableOTP($event:any){
    const val = $event.target.checked
    console.log(val)
    this.userService.enableOTP(val).subscribe((response:any)=>{
      if(response.status){
        const user = this.authService.retrieveUser()
        user.two_fa = val
        console.log(user)
        this.authService.storeUser(user)
        console.log(user)
        
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: `Success!`,
          text:response.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
      else{
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: `Success!`,
          text:response.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  saveChanges() {
    // Save changes logic
    if(!this.isReadOnly){
      const data = {profile_data:{...this.userBasicInfoForm.value,...this.userDetailsForm.value}}
      this.userService.saveprofile(data).pipe(take(1)).subscribe((response)=>{
        console.log(response)
        this.setInputBorder('black',true)
        this.username = this.username.split('[Editing]')[0]
        if(response.status){
          this.username = response?.data
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Success!`,
            text:`Your profile update was successful!`,
            showConfirmButton: false,
            timer: 1500
          })
        }
        else{
          Swal.fire({
            position: 'top-start',
            icon: 'error',
            title: `Failed!`,
            text:`Your profile update was unsuccessful!`,
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
      this.isReadOnly = true
    }
    
  }

  deleteUser() {
    // Delete user logic
  }

  resetPassword() {
    // Reset password logic
  }

  browserAvatar() {
    // Browse avatar logic
  }

  ngOnDestroy(){
    if(!this.isReadOnly){
      const save = confirm("You have changes not saved, select ok to save")
      if(save){
        this.saveChanges()
      }
    }
  }
}
