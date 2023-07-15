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
import { AuthStore } from 'src/app/services/states/auth-state-store.service';

@Component({
  selector: 'app-cableperiodicsubscription',
  templateUrl: './cableperiodicsubscription.component.html',
  styleUrls: ['./cableperiodicsubscription.component.css'] 
})

export class CableperiodicsubscriptionComponent {

  public cableForm:any;
  public plans:any;
  public submitted:any
  public is_admin:boolean = false;
  public cablesubscriptiondata:any 
  @Input() cablesubscriptions:any
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
    this.cableForm = this.formBuilder.group({
      active_subscribers:[''],
      service_provider:['',[Validators.required]],
      label: ['', [Validators.required]],
      iucnumber: ['', [Validators.required]],
      bouquet: ['', [Validators.required]],
      subscriptionsservice:['cable'],
      cableperiodic_select:[''],
      mode: [''],
  
    });

    this.utilityService.getServiceCustomers('cable').subscribe({
      next:(response:any) => {
        if (response.status){
          this.cablesubscriptiondata = response.data
        }
        else{ }
      }
    })
                                 
  }

  getsubscriptions(){
    return {
            cable:  {status:'Active',data:[
                    {iucnumber:'68103200070',label:'Home Texas',network:'Dstv',bouquet:'Dstv Premium'},{iucnumber:'08100000001',label:'Shop Customer room',network:'Gotv',bouquet:'Gotv Yakata'},
                    {iucnumber:'68100026002',label:'Office Tv',network:'Startimes',bouquet:'Startimes Classic'},{iucnumber:'08100000003',label:'Bedroom alagbaka',network:'Dstv',bouquet:'Dstv Asia'}
                    ]}
            }
  }

  greet(): void {
    this.sendMessageEvent.emit('Hello From Greet Component');

  }

  public openModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(AutosubplansComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
      modalRef.componentInstance.subscriptions_service = 'cable';
  }

  public openSubscriberModal() {
    console.log("Opening preferences modal...")
    const modalRef = this.modalService.open(SubscribersModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        size: <any>'xl', backdrop: 'static'
      });
      
    modalRef.componentInstance.subscriptions_service = 'cable';
  }

  onsubmit(cableForm:any){
    console.log("Amen ===> ",cableForm.value)
  }
  get f() { return this.cableForm?.controls; }

  // public onSubmit(mode:any,subscriptioncomponent=''){
  //   console.log("Amen ===> ",cableForm.value)
  // }
  // get f() { return this.cableForm?.controls; }
  private _isTVNETValid(control: AbstractControl) {
    const tvnet = ['DSTV','GOTV','STARTIMES']
    var p = control.value.split(",")[0].toUpperCase()
    var valid ;
    if (tvnet.includes(p)) {
      valid = true
      console.log("Valid tvnet ", tvnet.includes(p))
      
    }
    if (!valid){
      
      return { validTVNET: true };
  }
    return null;
  }

  protected ManualValidation(controls:any[]){
    if (this._isTVNETValid(controls[0])){
      return ("Invalid tvnet")
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
      var optiontext = `${Form.label}    IUC:   ${Form.iucnumber}    Network:   ${r[2]}    Plan: ${r[1]}`
      if (mode=='createMode'){
        let newOption = new Option(optiontext,optiontext);
        var cablesubscriber_select:any =  document.getElementById('cablesubscriber')
        cablesubscriber_select.add(newOption,undefined);
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

      let x:any = document.getElementById('cablenetwork_select')
      let y:any = document.getElementById('cablenetwork_label')
      let c:any = document.getElementById('cablenetwork_amount')
      let z:any =document.getElementById('cablenetwork_iucnumber')
      let p:any = document.getElementById('cableperiodic_select')
      console.log("::::::::::> ",x.value,y.value,c.value,z.value,p.value)
      var valid = this.ManualValidation([x,y,c,z,p])
      console.log(valid)

      var Form = this.cableForm.value
      Form['cableplan'] = c.value;
      Form['label'] = y.value;
      Form['iucnumber'] = z.value;
      Form['service_provider'] = x.value;
      Form['mode'] =  mode;
      Form['cableperiodic_select'] = p.value;
      this.cableForm.value = Form
      console.log('The form ',Form, this.cableForm.value)

      if(mode=="createMode"){
        
        if (valid==true){
          this.display = true
          let perm = this.subscriptionsservice.Confirm(subscriptioncomponent); 
          if (perm==true){
            this.subscriptionsservice.onSubmit(this.cableForm,subscriptioncomponent,mode).subscribe((r)=>{
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
            this.subscriptionsservice.onSubmit(this.cableForm,subscriptioncomponent,mode).subscribe((r)=>{
              this.Response(r,Form,mode)
            });
          }
        }
        else{return alert(valid)}
        
      }
  }

  public editMode(){return this.subscriptionsservice.EditMode('cable')}

  public createMode(){return this.subscriptionsservice.CreateMode('cable')}
  
  public getbeast(){return this.utilityService.getbeast()}
  
  public saveNewSubscriber(){this.subscriptionsservice.saveNewSubscriber('cable')}

  public getCableSelectionOption(){return this.subscriptionsservice.getSelectionOption('cable')}

  public saveChanges(subscriptioncomponent){this.subscriptionsservice.saveChanges(subscriptioncomponent)}

  public confirmdelete(subscriptioncomponent){this.subscriptionsservice.confirmdelete(subscriptioncomponent)}

  public activate(subscriptioncomponent,mode,id){return this.subscriptionsservice.activate(subscriptioncomponent,this.cablesubscriptiondata,mode,id)}

  public onOptionsSelected(value){this.subscriptionsservice.onOptionsSelected(value,'cable').subscribe({ next:(payload:any) => {this.plans= payload.data; console.log("Cable plans payload ", this.plans); } });}




}

export class CableperiodicsubscriptionComponentx { 

  static components = {
    lazy: CableperiodicsubscriptionComponent,
  };

}
       


