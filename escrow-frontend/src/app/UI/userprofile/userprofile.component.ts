import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

var self:any;

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
  selectedFile = ''
  imageUrl = 'https://th.bing.com/th/id/OIP.IOMe2yoWVktWq0iqdejK1wAAAA?w=174&h=180&c=7&r=0&o=5&dpr=2&pid=1.7'

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
    self = this
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
      this.imageUrl = response.profile_pics 
      console.log(this.imageUrl)
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

  ngAfterViewInit(){
    let photo_camera:any =  document.getElementById('photo_camera')
    photo_camera.addEventListener('change', function(event:any) {
        const fileInput = event.target;
        const previewImage:any = document.getElementById('previewImage');
        
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          
          reader.onload = function(e:any) {
            previewImage.src = e.target.result;
          };
          
          reader.readAsDataURL(fileInput.files[0]);
        }
        self.uploadImage()
    });
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
 
  // Component
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    this.userService.uploadprofilePic(formData).subscribe(response => {
      if(response){
        Swal.fire({
          position: 'bottom-start',
          icon: 'success',
          title: `Image uploaded successfully!`,
          text:`Your profile picture update was successful!`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
    
  }

  selectFile(){
    const fileInput:any = document.getElementById('photo_camera')
    fileInput.click()
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
