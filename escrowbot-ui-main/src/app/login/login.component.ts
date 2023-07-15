import { AlertComponent } from './../alert/alert.component';
import { Component, Type, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {ServiceLocator} from '.././locator.service';
import { TokenstorageService } from '../services/tokenstorage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { map } from 'rxjs/operators';
import { AuthStore } from '../services/states/auth-state-store.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form =new FormGroup({});
  submitted = false;
  loading = false;
  is_admin = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  public loader:any;
  public token_loader:any;
  public event_loader:any;
  static isLoggedIn: any = false;
  public serverEvents: any;
  private socket:any;
  private port:any = 3000;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authStore: AuthStore,
    private tokenstorageservice: TokenstorageService,
    private alertcomponent: AlertComponent) { 
    // this.loader = ServiceLocator.injector.get(AuthStore) 
    this.token_loader = ServiceLocator.injector.get(TokenstorageService)
  }
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
     });

    if (this.token_loader.getToken()) {
      // this.isLoggedIn = true;
      // this.roles = this.token_loader.getUser().roles;
    }
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form?.controls; }

  public delay(ms: number) {
    // alert(9000)
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  onSubmit(loginForm:any): void {
    this.submitted = true;
    if (this.form?.invalid) {
      console.log("Invalid form")
      return;
    
    }
    this.loading = true;

    this.authStore.login(this.f?.email.value, this.f?.password.value)
      // (data: { accessToken: any; }) => {
      .subscribe({
          next:(payload:any) => {
            console.log(payload)
            if (payload.status){
              console.log(payload.mail) //ekoemmanueljavlx@gmail.com
              this.token_loader.saveToken(payload.token);
              this.token_loader.saveUserid(payload.public_id);
              this.token_loader.saveUsername(payload.username);
              this.tokenstorageservice.saveMail(`${payload.mail}`);
              this.tokenstorageservice.savePhone(payload.phone);
              let data = {email:payload.mail,amount:null,phone:this.tokenstorageservice.getPhone(),orderRef:`${this.tokenstorageservice.getUser()}`} 
              window.sessionStorage.setItem("paymentdata",JSON.stringify(data))
              // alert("logged in succesfully")
              this.alertcomponent.showalert(`Logged in successfully`)
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              this.delay(500).then(()=>{
                // this.router.navigateByUrl('/dashboard')
                this.authStore.user$.subscribe({
                  next:(payload:any) => {this.is_admin = payload.is_admin;console.log(payload)}
                })//.pipe(map((user)=>{console.log(user.is_admin)}))
              })
              
              // this.dashboard(payload.username);
              
              // this.event_loader.connect("http://localhost:"+this.port)
              // this.dashboard(payload.username);
            }

            else{
              
            }
          },
          error:(err: { error: { msg: string; }; }) => {
            
            // this.errorMessage = err.error.message;
            console.log("Unauthorized ", err.error.msg)
            // this.alertService.error( err.error.msg, { keepAfterRouteChange: false })
            this.isLoginFailed = true;
            this.loading = false;
          }
       });
  }

  dashboard(username:string): void {
    this.router.navigate(['/Dashboard'],{state: {data: {"username":username}}});
    // this.isLoggedIn = false;
  }


}

