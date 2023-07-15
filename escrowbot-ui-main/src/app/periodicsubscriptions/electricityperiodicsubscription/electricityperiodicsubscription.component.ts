import { AuthStore } from './../../services/states/auth-state-store.service';
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
import { isValidPhone, validatePhone, isAirtimeAmountValid, isValidSubscriptionLabel, isSubscriptionAirtimeAmountValid } from 'src/app/customvalidator.validator';
import { AutosubplansComponent } from 'src/app/autosubplans/autosubplans.component';
import { SubscribersModalComponent } from 'src/app/subscribersmodal/subscribersmodal.component';

@Component({
  selector: 'app-electricityperiodicsubscription',
  templateUrl: './electricityperiodicsubscription.component.html',
  styleUrls: ['./electricityperiodicsubscription.component.css']
})
export class ElectricityperiodicsubscriptionComponent{
  public powersubscriptiondata:any 
  public plans:any;
  public submitted:any;
  public powerForm:any;
  public is_admin:boolean = false;
  @Input() electricitysubscription:any
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
    this.powerForm = this.formBuilder.group({
      active_subscribers:[''],
      service_provider:['',[Validators.required]],
      label: ['', [Validators.required]],
      meternumber: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      mode: [''],
      subscriptionsservice:['power'],
      powerperiodic_select:['']
    });
    this.powersubscriptiondata = this.getsubscriptions().electricity;
                                       
  }

  ngAfterViewInit():void{
    
  }

  onsubmit(powerForm:any){
    console.log("Amen ===> ",powerForm.value)
  }
  get f() { return this.powerForm?.controls; }

  private _isDISCOValid(control: AbstractControl) {
    const disco = ['BEDC','IBEDC','KAEDCO','KEDCO','AEDC','PHEDC','JEDCPLC','EKEDC','IKEDC']
    var p = control.value.split(",")[0].toUpperCase()
    var valid ;
    if (disco.includes(p)) {
      valid = true
      console.log("Valid disco ", disco.includes(p))
      
    }
    if (!valid){
      
      return { validDISCO: true };
  }
    return null;
  }

  getsubscriptions(){
    console.log("I must be called only once =====>")
    return {
          electricity:{status:'Active',data:[
                    {meternumber:'65100530004',label:'My Office',disco:'IBEDC',amount:'7000'},{meternumber:'65100000006',label:'Smart home',disco:'KAEDCO',amount:'3000'},
                    {meternumber:'65100000005',label:'Dad\'s house',disco:'PHEDC',amount:'12000'},{meternumber:'65100000007',label:'Home Texas',disco:'EKEDC',amount:'4500'}
                    ]}
            }
  }

  public openModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(AutosubplansComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
      modalRef.componentInstance.subscriptions_service = 'electricity';
  }

  public openSubscriberModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(SubscribersModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
    modalRef.componentInstance.subscriptions_service = 'electricity';
  }

  protected ManualValidation(controls:any[]){
    if (this._isDISCOValid(controls[0])){
      return ("Invalid disco")
    }
    // if (isSubscriptionDataPlanValid(controls[2])){
    //   return ("Invalid amount")
    // }
    // if (isValidIUC(controls[3])){
    //   return ("Invalid phone number")
    // }
    return true

  }
  
  private Response(r,Form:any,mode='createMode'){
    console.log(r)
    var messsage = r.message
    r = r.data
    if (r[0]==true){
      var optiontext = `${Form.label}    Meternumber:   ${Form.meternumber}    Disco:   ${r[2]}    Amount: ${r[1]}`
      if (mode=='createMode'){
        let newOption = new Option(optiontext,optiontext);
        var powersubscriber_select:any =  document.getElementById('powersubscriber')
        powersubscriber_select.add(newOption,undefined);
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
    let x:any = document.getElementById('powerdisco_select')
      let y:any = document.getElementById('powerdisco_label')
      let c:any = document.getElementById('powerdisco_amount')
      let z:any =document.getElementById('powerdisco_meterno')
      let p:any = document.getElementById('dataperiodic_select')
      console.log("::::::::::> ",x.value,y.value,c.value,z.value,p.value)
      var valid = this.ManualValidation([x,y,c,z,p])
      console.log(valid)

      var Form = this.powerForm.value
      Form['amount'] = c.value;
      Form['label'] = y.value;
      Form['meternumber'] = z.value;
      Form['service_provider'] = x.value;
      Form['mode'] =  mode;
      Form['powerperiodic_select'] = p.value;
      this.powerForm.value = Form
      console.log('The form ',Form, this.powerForm.value)

      if(mode=="createMode"){
        
        if (valid==true){
          this.display = true
          let perm = this.subscriptionsservice.Confirm(subscriptioncomponent); 
          if (perm==true){
            this.subscriptionsservice.onSubmit(this.powerForm,subscriptioncomponent,mode).subscribe((r)=>{
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
            this.subscriptionsservice.onSubmit(this.powerForm,subscriptioncomponent,mode).subscribe((r)=>{
              this.Response(r,Form,mode)
            });
          }
        }
        else{return alert(valid)}
        
      }
  
  }

  public editMode(){return this.subscriptionsservice.EditMode('power')}

  public createMode(){return this.subscriptionsservice.CreateMode('power')}
  
  public getbeast(){return this.utilityService.getbeast()}
  
  public saveNewSubscriber(){this.subscriptionsservice.saveNewSubscriber('power')}

  public getPowerSelectionOption(){return this.subscriptionsservice.getSelectionOption('power')}

  public saveChanges(subscriptioncomponent){this.subscriptionsservice.saveChanges(subscriptioncomponent)}

  public confirmdelete(subscriptioncomponent){this.subscriptionsservice.confirmdelete(subscriptioncomponent)}

  public activate(subscriptioncomponent,mode,id){return this.subscriptionsservice.activate(subscriptioncomponent,this.powersubscriptiondata,mode,id)}

  // public onOptionsSelected(value){this.subscriptionsservice.onOptionsSelected(value,'power').subscribe({ next:(payload:any) => {this.plans= payload.data; console.log("Power plans payload ", this.plans); } });}



  


}
