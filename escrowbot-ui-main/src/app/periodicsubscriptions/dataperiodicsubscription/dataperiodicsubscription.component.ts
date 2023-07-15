import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from 'src/app/services/utility.service';
import { FormBuilder, FormGroup, FormControl, Validators,NgForm, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { Component, NgModule, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { isValidPhone, validatePhone, isAirtimeAmountValid, isValidSubscriptionLabel, isSubscriptionAirtimeAmountValid, isISPValid } from 'src/app/customvalidator.validator';
import { AutosubplansComponent } from 'src/app/autosubplans/autosubplans.component';
import { SubscribersModalComponent } from 'src/app/subscribersmodal/subscribersmodal.component';
import { AuthStore } from 'src/app/services/states/auth-state-store.service';


@Component({
  selector: 'app-dataperiodicsubscription',
  templateUrl: './dataperiodicsubscription.component.html',
  styleUrls: ['./dataperiodicsubscription.component.css']
})
export class DataperiodicsubscriptionComponent {

  
  public dataForm:any;
  public submitted:any;
  public plans:any;
  public datasubscriptiondata:any 
  public is_admin:boolean = false;
  @Input() datasubscriptions:any
  @Output() sendMessageEvent = new EventEmitter();
  unsubscribe$: Subject<boolean> = new Subject();
  display: boolean;
  constructor(public activeModal: NgbActiveModal,public formBuilder: FormBuilder, public modalService: NgbModal,private authStore: AuthStore,
              public utilityService:UtilityService, private subscriptionsservice: SubscriptionsService) {
    
  }

  ngOnInit(): void {
    this.authStore.user$.subscribe({
      next:(payload:any) => {console.log(payload);this.is_admin = payload.is_admin;}
    })
    this.dataForm = this.formBuilder.group({
      active_subscribers:[''],
      service_provider:['',[Validators.required]],
      label: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],
      dataplan: ['', [Validators.required]],
      mode: [''],
      subscriptionsservice:['data'],
      dataperiodic_select:['']
  
    });
    this.utilityService.getServiceCustomers('data').subscribe({
      next:(response:any) => {
        if (response.status){
          this.datasubscriptiondata = response.data
        }
        else{ }
      }
    })
                                  
  }

  public openModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(AutosubplansComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
      modalRef.componentInstance.subscriptions_service = 'data';
  }

  public openSubscriberModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(SubscribersModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
    modalRef.componentInstance.subscriptions_service = 'data';
  }

  onsubmit(dataForm:any){
    console.log("Amen ===> ",dataForm.value)
  }
  get f() { return this.dataForm?.controls; }
  private _isISPValid(control: AbstractControl) {
    const isp = ['MTN','GLO','AIRTEL','ETISALAT']
    var p = control.value.split(",")[0].toUpperCase()
    var valid ;
    if (isp.includes(p)) {
      valid = true
      console.log("Valid isp ", isp.includes(p))
      
    }
    if (!valid){
      
      return { validISP: true };
  }
    return null;
  }

  getsubscriptions(){
    return {
            data:   {status:'Suspended',data:[
                    {phonenumber:'08100000004',label:'My Office Wifi',network:'Mtn',plan:'2.5GB'},{phonenumber:'08100000006',label:'Smart home MIfi',network:'Etisalat',plan:'40GB'},
                    {phonenumber:'08100000005',label:'Dad\'s Mtn line',network:'Airtel',plan:'12GB'},{phonenumber:'08100000007',label:'Mums\'s Airtel',network:'Glo',plan:'7GB'}
                    ]},
            
            }
  }

  protected ManualValidation(controls:any[]){
    if (this._isISPValid(controls[0])){
      return ("Invalid isp")
    }
    // if (isSubscriptionDataPlanValid(controls[2])){
    //   return ("Invalid amount")
    // }
    if (isValidPhone(controls[3])){
      return ("Invalid phone number")
    }
    return true

  }
  private Response(r,Form:any,mode='createMode'){
    console.log(r)
    var messsage = r.message
    r = r.data
    if (r[0]==true){
      var optiontext = `${Form.label}    Phone:   ${Form.phonenumber}    Network:   ${r[2]}    Dataplan: ${r[1]}`
      if (mode=='createMode'){
        let newOption = new Option(optiontext,optiontext);
        var datasubscriber_select:any =  document.getElementById('datasubscriber')
        datasubscriber_select.add(newOption,undefined);
      }
      else{
        // let newOption = new Option(optiontext,optiontext);
        // var datasubscriber_select:any =  document.getElementById('datasubscriber')
        // datasubscriber_select.add(newOption,undefined);
      }
      
      console.log(messsage)
      alert(messsage)
      return null
    }
  }
  public onSubmit(mode:any,subscriptioncomponent=''){
      let x:any = document.getElementById('datanetwork_select')
      let y:any = document.getElementById('datanetwork_label')
      let c:any = document.getElementById('dataplan')
      let z:any =document.getElementById('datanetwork_phone')
      let p:any = document.getElementById('dataperiodic_select')
      console.log("::::::::::> ",x.value,y.value,c.value,z.value,p.value)
      var valid = this.ManualValidation([x,y,c,z,p])
      console.log(valid)

      var Form = this.dataForm.value
      Form['dataplan'] = c.value;
      Form['label'] = y.value;
      Form['phonenumber'] = z.value;
      Form['service_provider'] = x.value;
      Form['mode'] =  mode;
      Form['dataperiodic_select'] = p.value;
      this.dataForm.value = Form
      console.log('The form ',Form, this.dataForm.value)

      if(mode=="createMode"){
        
        if (valid==true){
          this.display = true
          let perm = this.subscriptionsservice.Confirm(subscriptioncomponent); 
          if (perm==true){
            this.subscriptionsservice.onSubmit(this.dataForm,subscriptioncomponent,mode).subscribe((r)=>{
              this.Response(r,Form)
            });
          }
        }
        else{return alert(valid)}
        
        };
      if(mode=="editMode"){
        
        if (valid==true){
          let perm = this.subscriptionsservice.Confirm(subscriptioncomponent,true); 
          if (perm==true){
            this.subscriptionsservice.onSubmit(this.dataForm,subscriptioncomponent,mode).subscribe((r)=>{
              this.Response(r,Form,mode)
            });
          }
        }
        else{return alert(valid)}
        
      }
  }

  public editMode(){return this.subscriptionsservice.EditMode('data')}

  public createMode(){return this.subscriptionsservice.CreateMode('data')}
  
  public getbeast(){return this.utilityService.getbeast()}
  
  public saveNewSubscriber(){this.subscriptionsservice.saveNewSubscriber('data')}

  public getDataSelectionOption(){return this.subscriptionsservice.getSelectionOption('data')}

  public saveChanges(subscriptioncomponent){this.subscriptionsservice.saveChanges(subscriptioncomponent)}

  public confirmdelete(subscriptioncomponent){this.subscriptionsservice.confirmdelete(subscriptioncomponent)}

  public activate(subscriptioncomponent,mode,id){return this.subscriptionsservice.activate(subscriptioncomponent,this.datasubscriptiondata,mode,id)}

  public onOptionsSelected(value){this.subscriptionsservice.onOptionsSelected(value,'data').subscribe({ next:(payload:any) => {this.plans= payload.data; console.log("Data plans payload ", this.plans); } });}


}
