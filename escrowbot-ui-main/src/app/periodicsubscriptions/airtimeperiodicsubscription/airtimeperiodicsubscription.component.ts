import { SubscribersModalComponent } from './../../subscribersmodal/subscribersmodal.component';
import { AutosubplansComponent } from './../../autosubplans/autosubplans.component';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from 'src/app/services/utility.service';
import { FormBuilder, FormGroup, FormControl, Validators,NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { Component, NgModule, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { isValidPhone, validatePhone, isAirtimeAmountValid, isValidSubscriptionLabel, isSubscriptionAirtimeAmountValid, isISPValid } from 'src/app/customvalidator.validator';
import { AuthStore } from 'src/app/services/states/auth-state-store.service';

@Component({
  selector: 'app-airtimeperiodicsubscription',
  templateUrl: './airtimeperiodicsubscription.component.html',
  styleUrls: ['./airtimeperiodicsubscription.component.css']
}) 
export class AirtimeperiodicsubscriptionComponent implements OnInit{

  airtimeForm:any =new FormGroup({});
  submitted:boolean;
  publishing:boolean;
  display:boolean = false;
  is_admin:boolean = false;

  public airtimesubscriptiondata:any;
  @Input() airtimesubscriptions:any
  @Output() sendMessageEvent = new EventEmitter();
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(public activeModal: NgbActiveModal,public formBuilder: FormBuilder, public modalService: NgbModal,private authStore: AuthStore,
              public utilityService:UtilityService, private subscriptionsservice: SubscriptionsService) {
    
  }

  ngOnInit(): void {
    this.authStore.user$.subscribe({
      next:(payload:any) => {console.log(payload);this.is_admin = payload.is_admin;}
    })
    this.airtimeForm = this.formBuilder.group({ 
        subscriptionsservice:['airtime'],
        active_subscribers:[''],
        service_provider:['',[isISPValid]],
        label: [''],
        phonenumber: ['',[isValidPhone]],
        amount: ['',[isSubscriptionAirtimeAmountValid]],
        mode: [''],
        airtimeperiodic_select:['']
    
     });
     this.utilityService.getServiceCustomers('airtime').subscribe({
      next:(response:any) => {
        if (response.status){
          this.airtimesubscriptiondata = response.data
        }
        else{ }
      }
    })
     
     
    
    
  }

  getsubscriptions(){
    return {airtime:{status:'Active',data:[
              {phonenumber:'08100000000',label:'Chicken republic',network:'Mtn',amount:'2500'},{phonenumber:'08100000001',label:'Guaranteed Trust Bank',network:'Etisalat',amount:'4500'},
              {phonenumber:'08100000002',label:'Dominos pizza',network:'Airtel',amount:'3000'},{phonenumber:'08100000003',label:'Shoprite mall',network:'Glo',amount:'7000'}
              ]},
            }
  }
  // convenience getter for easy access to form fields
  get f() { return this.airtimeForm?.controls; }
  onsubmit(airtimeForm:any){
    this.publishing = true
    console.log("Amen ===> ",airtimeForm.value)
  }

  public openModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(AutosubplansComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
    modalRef.result.then((result:any) => {
    }, (reason:any) => {
    });
  }

  public openSubscriberModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(SubscribersModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
    modalRef.componentInstance.subscriptions_service = 'airtime';
  }

  protected ManualValidation(controls:any[]){
    if (isISPValid(controls[0])){
      return ("Invalid isp")
    }
    if (isSubscriptionAirtimeAmountValid(controls[2])){
      return ("Invalid amount")
    }
    if (isValidPhone(controls[3])){
      return ("Invalid phone number")
    }
    return true

  }
  private Response(r,Form:any){

    console.log(r)
    var message = r.message
    r = r.data
    if (r[0]==true){
      var optiontext = `${Form.label}    Phone:   ${Form.phonenumber}    Network:   ${r[1]}    Amount: ${Form.amount}`
      let newOption = new Option(optiontext,optiontext);
      var airtimesubscriber_select:any =  document.getElementById('airtimesubscriber')
      airtimesubscriber_select.add(newOption,undefined);
      console.log(message)
      alert(message)
      return null
    }
  }
  
  public async onSubmit(mode:any,subscriptioncomponent=''){

    let x:any = document.getElementById('airtimenetwork_select')
    let y:any = document.getElementById('airtimenetwork_label')
    let c:any = document.getElementById('airtimenetwork_amount')
    let z:any =document.getElementById('airtimenetwork_phone')
    let p:any = document.getElementById('airtimeperiodic_select')
    console.log("::::::::::> ",x.value,y.value,c.value,z.value,p.value)
    var valid = this.ManualValidation([x,y,c,z,p])
    console.log(valid)

    var Form = this.airtimeForm.value
    Form['amount'] = c.value;
    Form['label'] = y.value;
    Form['phonenumber'] = z.value;
    Form['service_provider'] = x.value;
    Form['mode'] =  mode;
    Form['airtimeperiodic_select'] = p.value;
    this.airtimeForm.value = Form
    console.log('The form ',Form, this.airtimeForm.value)

    if(mode=="createMode"){
      
      if (valid==true){
        this.display = true
        let perm = this.subscriptionsservice.Confirm(subscriptioncomponent); 
        if (perm==true){
          this.subscriptionsservice.onSubmit(this.airtimeForm,subscriptioncomponent,mode).subscribe((r)=>{
            this.Response(r,Form)
          });
        }
      }
      else return alert(valid)
      
      };
    if(mode=="editMode"){
      
      if (valid==true){
        let perm = this.subscriptionsservice.Confirm(subscriptioncomponent,true); 
        if (perm==true){
          this.subscriptionsservice.onSubmit(this.airtimeForm,subscriptioncomponent,mode).subscribe((r)=>{
            this.Response(r,Form)
          });
        }
      }
      else return alert(valid)
      
    }
    
  }
  

  public editMode(){return this.subscriptionsservice.EditMode('airtime')}

  public createMode(){return this.subscriptionsservice.CreateMode('airtime')}
  
  public getbeast(){return this.utilityService.getbeast()}

  public saveNewSubscriber(){this.subscriptionsservice.saveNewSubscriber('airtime')}

  public getAirtimeSelectionOption(){return this.subscriptionsservice.getSelectionOption('airtime')}

  public saveChanges(subscriptioncomponent){this.subscriptionsservice.saveChanges(subscriptioncomponent)}

  public confirmdelete(subscriptioncomponent){this.subscriptionsservice.confirmdelete(subscriptioncomponent)}

  public activate(subscriptioncomponent,mode,id){return this.subscriptionsservice.activate(subscriptioncomponent,this.airtimesubscriptiondata,mode, id)}

  
}
