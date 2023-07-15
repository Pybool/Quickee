import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'escrow';
  loggedIn:boolean = false
  user:any = {}

  constructor(private authServive: AuthService){}

  ngOnInit(){
    this.authServive.getVendorSubscription().subscribe((status:boolean)=>{
      this.user.is_vendor = status
    })

    this.authServive.getAuthStatus().subscribe((status:boolean)=>{
      this.loggedIn = status || this.getAuth()
    })

    
  }

  logOut(){
    this.loggedIn = false
    this.authServive.removeUser()
    this.authServive.removeToken()

  }

  toggleAccordion(id:string){
    const accordion:any = document.querySelector(`#${id}`)
    // const logo:any = document.querySelector(`#logos`)
    accordion.classList.toggle('collapse')
  }

  hideDropdown() {
    setTimeout(function() {
        var dropdownMenu:any = document.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'none';
    }, 3000);
}

  getAuth(){
    this.user = this.authServive.retrieveUser()
    if(this.user){
      this.loggedIn = true
    }
    else{
      this.loggedIn = false
    }
    return this.loggedIn
  }
}
