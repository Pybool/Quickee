import { Component, NgModule,Type, ComponentFactoryResolver, ViewContainerRef ,ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import disableElementsAndChildren, { UtilityService } from 'src/app/services/utility.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-eko-modal',
  templateUrl: './eko-modal.component.html',
  styleUrls: ['./eko-modal.component.css']
})

export class EkoModalComponent {
  form: FormGroup;
  public createMode:boolean = false;
  public editMode:boolean = false;
  public subscriptions:any = [1,2,3]
  public cableloaded:string = UtilityService.prototype.cableloaded;
  public datasubscriptions:any;
  public airtimesubscriptions:any;
  public cablesubscriptions:any;
  public electricitysubscription:any;
  public x_load_permit:string;
  private dataElementsToDefault = ['datanetwork_select','datanetwork_label','datanetwork_phone','datanetwork_amount']
  private cableElementsToDefault = ['cablenetwork_select','cablenetwork_label','cablenetwork_iucnumber','cablenetwork_amount']
  private airtimeElementsToDefault = ['airtimenetwork_select','airtimenetwork_label','airtimenetwork_phone','airtimenetwork_amount']
  private electricityElementsToDefault = ['electricitydisco_select','electricitydisco_label','electricitydisco_meter_number','electricitydisco_amount']
  unsubscribe$: Subject<boolean> = new Subject();
 testmode = "falsy"
 display = true
  @ViewChild('genericperiodiccomponent', { read: ViewContainerRef })
  private genericperiodiccomponentviewcontainerref: ViewContainerRef;
  constructor(
            public activeModal: NgbActiveModal,
            public formBuilder: FormBuilder, 
            public utilityService:UtilityService,
            private vcref: ViewContainerRef,
            private cfr: ComponentFactoryResolver
            
          ) { }
      ngOnInit(): void {
        this.subscriptions = this.getsubscriptions()
        this.utilityService.watchDogScroller().then(()=>{
            this.utilityService.getMessage()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                (x_load_permit) => 
                {this.x_load_permit = x_load_permit;
                  if (this.x_load_permit == 'loadairtimegradle'){
                    this.loadAirtimeperiodicsubscriptionComponent().then(()=>{})
                    console.log("The airtime should appear now ")
                    this.airtimesubscriptions = this.subscriptions.airtime
                    this.utilityService.changeMessage(this.airtimesubscriptions)
            
                  }

                  if (this.x_load_permit == 'loaddatagradle'){
                    
                    this.loadDataperiodicsubscriptionComponent().then(()=>{})
                    console.log("The data should appear now ")
                    this.datasubscriptions = this.subscriptions.data
                    this.utilityService.changeMessage(this.datasubscriptions)
                
                  }

                  if (this.x_load_permit == 'loadcablegradle'){
                    console.log("The cable should appear now ")
                    this.cablesubscriptions = this.subscriptions.cable
                    this.utilityService.changeMessage(this.cablesubscriptions).then(()=>{
                        this.loadCableperiodicsubscriptionComponent().then(()=>{
                          console.log("Changed message")
                          this.x_load_permit = 'null';
                          // this.unsubscribe$.next(true);
                          // this.unsubscribe$.complete();
                        })
                    })
                  }

                  if (this.x_load_permit == 'loadpowergradle'){
                    console.log("The power should appear now ")
                    this.electricitysubscription = this.subscriptions.electricity
                    this.utilityService.changeMessage(this.electricitysubscription).then(()=>{
                        this.loadElectricityperiodicsubscriptionComponent().then(()=>{
                          console.log("Changed message")
                          this.x_load_permit = 'null';
                          this.unsubscribe$.next(true);
                          this.unsubscribe$.complete();
                        })
                    })
                  }
            })      
        })
        this.form = this.formBuilder.group({
          network: ['',[Validators.required]],
          phone: ['',[Validators.required]],
          amount:['',[Validators.required]]
         });
        
        
        this.electricitysubscription = this.subscriptions.electricity
        console.log("Loading first ",this.subscriptions)
       
      }

      endmodal(msg:any){
        console.log("end modal side ")
        this.utilityService.modaldismiss()
        this.activeModal.close(msg);
      }
     
      get f() { return this.form.controls; }
      closeModal(message: string) {
        console.log("active modal side ")
        this.utilityService.modaldismiss()
        this.activeModal.close();
      }

      async loadAirtimeperiodicsubscriptionComponent(){
    
        // this.vcref.clear();
        const { AirtimeperiodicsubscriptionComponent } = await import('../periodicsubscriptions/airtimeperiodicsubscription/airtimeperiodicsubscription.component');
        let airtimeperiodicsubscriptionComponent = this.genericperiodiccomponentviewcontainerref.createComponent(
          this.cfr.resolveComponentFactory(AirtimeperiodicsubscriptionComponent)
          
        );
        
        airtimeperiodicsubscriptionComponent.instance.airtimesubscriptions = this.airtimesubscriptions;
        airtimeperiodicsubscriptionComponent.instance.sendMessageEvent.subscribe(data => {
          console.log('WHERE',data);
        })
      
      }

      async loadDataperiodicsubscriptionComponent(){
    
        // this.vcref.clear();
        const { DataperiodicsubscriptionComponent } = await import('../periodicsubscriptions/dataperiodicsubscription/dataperiodicsubscription.component');
        let dataperiodicsubscriptionComponent = this.genericperiodiccomponentviewcontainerref.createComponent(
          this.cfr.resolveComponentFactory(DataperiodicsubscriptionComponent)
        );
        dataperiodicsubscriptionComponent.instance.datasubscriptions = this.datasubscriptions;
            dataperiodicsubscriptionComponent.instance.sendMessageEvent.subscribe(data => {
              console.log(data);
            })
      
      }

      async loadCableperiodicsubscriptionComponent(){
    
        // this.vcref.clear();
        const { CableperiodicsubscriptionComponent } = await import('../periodicsubscriptions/cableperiodicsubscription/cableperiodicsubscription.component');
        let cableperiodicsubscriptionComponent = this.genericperiodiccomponentviewcontainerref.createComponent(
          this.cfr.resolveComponentFactory(CableperiodicsubscriptionComponent)
        );
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ",document.getElementById('cableform'))
        disableElementsAndChildren('cableform')
        cableperiodicsubscriptionComponent.instance.cablesubscriptions = this.cablesubscriptions;
            cableperiodicsubscriptionComponent.instance.sendMessageEvent.subscribe(data => {
              console.log(data);
            })
      
      }

      async loadElectricityperiodicsubscriptionComponent(){
    
        // this.vcref.clear();
        const { ElectricityperiodicsubscriptionComponent } = await import('../periodicsubscriptions/electricityperiodicsubscription/electricityperiodicsubscription.component');
        let electricityperiodicsubscriptionComponent = this.genericperiodiccomponentviewcontainerref.createComponent(
          this.cfr.resolveComponentFactory(ElectricityperiodicsubscriptionComponent)
        );
        disableElementsAndChildren('powerform')
        electricityperiodicsubscriptionComponent.instance.electricitysubscription = this.electricitysubscription;
            electricityperiodicsubscriptionComponent.instance.sendMessageEvent.subscribe(data => {
              console.log(data);
            })
      
      }

      getsubscriptions(){
        console.log("I must be called only once =====>")
        return {airtime:{status:'Active',data:[
                        {phonenumber:'08100000000',label:'Chicken republic',network:'Mtn',amount:'2500'},{phonenumber:'08100000001',label:'Guaranteed Trust Bank',network:'Etisalat',amount:'4500'},
                        {phonenumber:'08100000002',label:'Dominos pizza',network:'Airtel',amount:'3000'},{phonenumber:'08100000003',label:'Shoprite mall',network:'Glo',amount:'7000'}
                        ]},
                data:   {status:'Suspended',data:[
                        {phonenumber:'08100000004',label:'My Office Wifi',network:'Mtn',plan:'2.5GB'},{phonenumber:'08100000006',label:'Smart home MIfi',network:'Etisalat',plan:'40GB'},
                        {phonenumber:'08100000005',label:'Dad\'s Mtn line',network:'Airtel',plan:'12GB'},{phonenumber:'08100000007',label:'Mums\'s Airtel',network:'Glo',plan:'7GB'}
                        ]},
                cable:  {status:'Active',data:[
                        {iucnumber:'68103200070',label:'Home Texas',network:'Dstv',bouquet:'Dstv Premium'},{iucnumber:'08100000001',label:'Shop Customer room',network:'Gotv',bouquet:'Gotv Yakata'},
                        {iucnumber:'68100026002',label:'Office Tv',network:'Startimes',bouquet:'Startimes Classic'},{iucnumber:'08100000003',label:'Bedroom alagbaka',network:'Dstv',bouquet:'Dstv Asia'}
                        ]},
              electricity:{status:'Active',data:[
                        {meternumber:'65100530004',label:'My Office',disco:'IBEDC',amount:'7000'},{meternumber:'65100000006',label:'Smart home',disco:'KAEDCO',amount:'3000'},
                        {meternumber:'65100000005',label:'Dad\'s house',disco:'PHEDC',amount:'12000'},{meternumber:'65100000007',label:'Home Texas',disco:'EKEDC',amount:'4500'}
                        ]}
                }
      }
      public getAirtimeSelectionOption(){
        // console.log(sel.options[sel.selectedIndex].text)
        var sel:any = document.getElementById("airtimesubscriber");
        var text= sel.options[sel.selectedIndex].text;
        // console.log(text)
        return text
      }

      private defaultDisabled(args){

        for(let defaultstate of args){
            document.getElementById(defaultstate).style.opacity = '0.5'; 
            document.getElementById(defaultstate).style.pointerEvents = "none";
        }
      }

      // public saveChanges(subscriptioncomponent){
      //   console.log("Saving changes made")
      //   let lambdas = {'airtime':this.defaultDisabled(this.airtimeElementsToDefault),'data':this.defaultDisabled(this.dataElementsToDefault)}
      //   this.editMode = false;
      //   return lambdas[subscriptioncomponent]
      // }

      public saveNewSubscriber(){
        console.log("Created a new subscriber")
        this.defaultDisabled([])
        document.getElementById('createmodediv').style.display = "none"; 
        document.getElementById('activatediv').style.display = "block"; 
        this.editMode = false;
      }

      public confirmdelete(subscriptiontype) {
        if (subscriptiontype=='airtime'){
            var sel = this.getAirtimeSelectionOption()
            if (sel ===`View ${this.subscriptions.airtime.data.length} active subscribers`){
              alert('You have not selected a valid subscriber to delete')
              return null
            }
        }
        
        console.log('Are you sure you want to delete this subscriber ? ',sel)
        var confirmation = confirm('Are you sure you want to delete this subscriber ?\n\n '+sel)
        console.log("confirmation ", confirmation)
    }


    public activate(Elements:any,mode:any){
      var flag:boolean = false;
      var sel = this.getAirtimeSelectionOption()
      if (mode=='editmode'){
        this.createMode = false;
          if (sel ===`View ${this.subscriptions.airtime.data.length} active subscribers`){
            this.createMode = false;
            // document.getElementById('createmodediv').style.display = "none";  
              alert('You have not selected a valid subscriber to Edit')
              return null
          }
          else{

              for (let element in Elements){

                let el:any = document.getElementById(Elements[element]);
                el.style.opacity = 1;
                el.style.pointerEvents = "auto";
                let selector = String(Elements[element].split("network")[0])
                this.editMode = true;
            }

          }
      }
      else{
          document.getElementById('activatediv').style.display = "none";  
          
          for (let element in Elements){

            let el:any = document.getElementById(Elements[element]);
            el.style.opacity = 1;
            el.style.pointerEvents = "auto";
            if (!flag){
                if (Elements[element].includes('airtime') || Elements[element].includes('data')){
                  let selector = String(Elements[element].split("network")[0])
                  console.log("The selector ", `${selector}editbtn`)
                  // document.getElementById(`${selector}editbtn`).innerHTML = "Save new subscriber";
                  this.createMode = true;
                  // this.editMode = false;
                  flag = true;
              }
    
              if (Elements[element].includes('cable')){
                  document.getElementById(`cableeditbtn`).innerHTML = "Save new IUC number";  
              }
    
              if (Elements[element].includes('disco')){
                document.getElementById(`discoeditbtn`).innerHTML = "Save new meter Number";  
            }
          }

      }
        
      }
      
      console.log("Create mode ", this.createMode)
      try{
        document.getElementById('createmodediv').style.display = "block";  
      }
      catch(err:any){

      }
      
    }

}
