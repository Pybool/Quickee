import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-merchantprofile',
  templateUrl: './merchantprofile.component.html',
  styleUrls: ['./merchantprofile.component.css']
})
export class MerchantprofileComponent {
  isReadOnly:boolean = true
  username:string = 'N/A'
  merchant_profile:any = {}
  
  constructor(private userService: UserService){}

  ngOnInit(){
    
  }
  
  browserAvatar() {
    // Browse avatar logic
  }

  ngAfterViewInit(){
    this.userService.getActiveMerchant().subscribe((response:any)=>{
      this.merchant_profile = response.data
      setTimeout(()=>{
        const pm:any = document.querySelector("#payment-modal")
        pm.click()
      },200)
    })
  }

  reportSeller(){

  }

}
