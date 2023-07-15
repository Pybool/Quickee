import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { titleCase, UtilityService } from './utility.service';
var x_forms = ['airtimeform','dataform','cableform','powerform']

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  public Dataplans:any;
  public createMode:boolean = false;
  public editMode:boolean = false;
  public datacreateMode:boolean = false;
  public dataeditMode:boolean = false;
  public cablecreateMode:boolean = false;
  public cableeditMode:boolean = false;
  public values;
  public powercreateMode:boolean = false;
  public powereditMode:boolean = false;
  public pendingdisable:any = []
  public subscriptions:any = [0]
  public datasubscriptions:any;
  public airtimesubscriptions:any;
  public cablesubscriptions:any;
  public electricitysubscription:any;
  public x_load_permit:string;
  private dataElementsToDefault = ['datanetwork_select','datanetwork_label','datanetwork_phone','dataplan','dataperiodic_select']
  private electricityElementsToDefault = ['powerdisco_select','powerdisco_label','powerdisco_meterno','powerdisco_amount','powerperiodic_select']
  private cableElementsToDefault = ['cablenetwork_select','cablenetwork_label','cablenetwork_iucnumber','cablenetwork_amount','cableperiodic_select']
  private airtimeElementsToDefault = ['airtimenetwork_select','airtimenetwork_label','airtimenetwork_phone','airtimenetwork_amount','airtimermvbtn','airtimeperiodic_select']

  form: any;
  constructor(public http: HttpClient, private utilityService:UtilityService) { }

      public getSelectionOption(subscriptioncomponent){
      
        var e = subscriptioncomponent + "subscriber"
        var sel:any = document.getElementById(e);
        var text= sel.options[sel.selectedIndex].text;
        console.log(text,this.editMode)
        try{
          if (subscriptioncomponent=='airtime'){
            const label = text.split('Phone:')[0].trim()
            const phonenumber = text.match(/Phone:(.*?)Network:/i)[1].trim()
            const network = text.match(/Network:(.*?)Amount:/i)[1].trim()
            const amount = text.split('Amount:')[1].trim()
            var label_el:any = document.getElementById('airtimenetwork_label')
            label_el.value = label;
            var phone_el:any = document.getElementById('airtimenetwork_phone')
            phone_el.value = phonenumber;
            var select:any = document.getElementById('airtimenetwork_select')
            // select.value = label;
            $('#airtimenetwork_select').val(network.toUpperCase());
            var amount_el:any = document.getElementById('airtimenetwork_amount')
            amount_el.value = amount;
            console.log("Edit insert vals ",label,phonenumber,network,amount)

          }

          if (subscriptioncomponent=='data'){
            // Dad's Mtn line  Phone: 08100000005   Network: Airtel   Dataplan: 12GB
            const label = text.split('Phone:')[0].trim()
            const phonenumber = text.match(/Phone:(.*?)Network:/i)[1].trim()
            const network = text.match(/Network:(.*?)Dataplan:/i)[1].trim()
            var label_el:any = document.getElementById('datanetwork_label')
            label_el.value = label;
            var phone_el:any = document.getElementById('datanetwork_phone')
            phone_el.value = phonenumber;
            console.log("Edit insert vals ",label,phonenumber,network)

          }

          if (subscriptioncomponent=='cable'){
            // Dad's Mtn line  Phone: 08100000005   Network: Airtel   Dataplan: 12GB
            const label = text.split('IUC:')[0].trim()
            const iucnumber = text.match(/IUC:(.*?)Network:/i)[1].trim()
            const network = text.match(/Network:(.*?)Bouquet:/i)[1].trim()
            var label_el:any = document.getElementById('cablenetwork_label')
            label_el.value = label;
            var iuc_el:any = document.getElementById('cablenetwork_iucnumber')
            iuc_el.value = iucnumber;
            console.log("Edit insert vals ",label,iucnumber,network)

          }

        }
        catch(err:any){}
        if (this.editMode){this.editModeStyles(subscriptioncomponent,text,false)}
        if (this.dataeditMode){this.editModeStyles(subscriptioncomponent,text,false)}
        if (this.cableeditMode){this.editModeStyles(subscriptioncomponent,text,false)}
        if (this.powereditMode){this.editModeStyles(subscriptioncomponent,text,false)}
        
        return text
      }

      private editModeStyles(subscriptioncomponent,text, Default=true){

        if (Default){
          document.getElementById(`${subscriptioncomponent}editlink`).innerHTML = `Edit`
          document.getElementById(`${subscriptioncomponent}editlink`).style.color = '#007bff'
        }
        else{
          console.log("i was called edit sytles ")
          // document.getElementById(`${subscriptioncomponent}editlink`).innerHTML = `Editing ${text.replace(/\s{2,}/g, ' ')}`
          // document.getElementById(`${subscriptioncomponent}editlink`).style.color = 'rgb(52, 221, 26)'
        } 
          document.getElementById('modalactionheader').innerHTML = ` ${titleCase(subscriptioncomponent)}: Editing ${String(text).replace(/\s{2,}/g, ' ')}`
      }

      private createModeStyles(id,text){
        document.getElementById(id).innerHTML = `${text}`
        document.getElementById(id).style.color = '#007bff'
        let subscriptioncomponent = id.split('editlink')[0]
        var e = subscriptioncomponent + "subscriber"
        document.getElementById(e).style.opacity = '0.7'; 
        document.getElementById('modalactionheader').innerHTML = ` ${titleCase(subscriptioncomponent)}: ${text} `
        
      }

      private defaultDisabled(args:any){
        
        for(let defaultstate of args){
            document.getElementById(defaultstate).style.opacity = '0.5'; 
            document.getElementById(defaultstate).style.pointerEvents = "none";
        }
      }

      public Confirm(subscriptioncomponent,edit=false){
        var confirmation;
        if (edit==false){confirmation = confirm(`Are you sure you want to create a new subscriber ?`)}
        if (edit==true){confirmation = confirm(`Are you sure you want to save changes made to :\n\n${this.getSelectionOption(subscriptioncomponent)}`)}
            if (confirmation){return true}
            else{return false}
      }

      public saveChanges(subscriptioncomponent,values=''): Observable<any>{
        var subject = new Subject<any>();
        this.utilityService.editSubscription(values)
        .subscribe({
            next:(payload:any) => {
              if (payload.status){
                console.log("Backend response for updated subscription ", payload.message);
                console.log("Saving changes made")
                switch(subscriptioncomponent) {
                  case 'airtime':
                    this.defaultDisabled(this.airtimeElementsToDefault)
                    break;
                  case 'data':
                    this.defaultDisabled(this.dataElementsToDefault)
                    break;
                  case 'cable':
                    this.defaultDisabled(this.cableElementsToDefault)
                    break;
                    case 'power':
                      this.defaultDisabled(this.electricityElementsToDefault)
                      break;
                  default:
                    // code block
                }
                this.resetEditmode(subscriptioncomponent)
                this.editModeStyles(subscriptioncomponent,'',true)
                for(let form of x_forms){
                    console.log("Indexes ", form)
                    this.utilityService.resetTodisableElements()
                    this.utilityService.enableElementsAndChildren(form)
                }
                this.resetSubscriptionModes()
                if(subscriptioncomponent !='power'){
                  var elid:any = document.getElementById(`${subscriptioncomponent}network_label`)
                  document.getElementById(`${subscriptioncomponent}editlink`).style.pointerEvents = "auto";
                  elid.placeholder="Enter a label"
                  document.getElementById('modalactionheader').innerHTML = `` 
                }

                if(subscriptioncomponent =='power'){
                  var elid:any = document.getElementById(`${subscriptioncomponent}disco_label`)
                  document.getElementById(`${subscriptioncomponent}editlink`).style.pointerEvents = "auto";
                  elid.placeholder="Enter a label"
                  document.getElementById('modalactionheader').innerHTML = `` 
                }
                
                subject.next(payload);
                // return {status:true,data:"Subscriber updated"}
                } 
          },
        });
        return subject.asObservable();
   
      }

      public saveNewSubscriber(subscriptioncomponent,values=''): Observable<any>{
            var subject = new Subject<any>();
            this.utilityService.newSubscription(values)
            .subscribe({
                next:(payload:any) => {
                  if (payload.status){
                    console.log("Backend response for created subscription ", payload.message);
                    this.defaultDisabled(this.airtimeElementsToDefault)
                    if (subscriptioncomponent=='airtime'){document.getElementById('createmodediv').style.display = "none";  }
                    if (subscriptioncomponent=='data'){document.getElementById('datacreatemodediv').style.display = "none";  }
                    if (subscriptioncomponent=='cable'){document.getElementById('cablecreatemodediv').style.display = "none";  }
                    if (subscriptioncomponent=='power'){document.getElementById('powercreatemodediv').style.display = "none";  }

                    if (subscriptioncomponent=='airtime'){document.getElementById('activatediv').style.display = "block";  }
                    if (subscriptioncomponent=='data'){document.getElementById('dataactivatediv').style.display = "block";  }
                    if (subscriptioncomponent=='cable'){document.getElementById('cableactivatediv').style.display = "block";  }
                    if (subscriptioncomponent=='power'){document.getElementById('poweractivatediv').style.display = "block";  }

                    this.editModeStyles(subscriptioncomponent,'')
                    this.resetEditmode(subscriptioncomponent)
                    this.resetCreatemode(subscriptioncomponent)
                    var e = subscriptioncomponent + "subscriber"
                    document.getElementById(e).style.opacity = '1';
                    for(let form of x_forms){
                      console.log("Indexes ", form)
                      this.utilityService.resetTodisableElements()
                      this.utilityService.enableElementsAndChildren(form) 
                    }
                    this.resetSubscriptionModes()
                    document.getElementById('modalactionheader').innerHTML = `` 
                    subject.next(payload);
                    // return {status:true,data:"New subscriber added"}
                  
                  }
                  
              },
            });
            return subject.asObservable();
 
      }

      public confirmdelete(subscriptioncomponent) {
        if (subscriptioncomponent=='airtime'){
            var sel = this.getSelectionOption(subscriptioncomponent)
            if (sel ===`Select to edit or view ${this.airtimesubscriptions.data.length} active subscribers`){
              alert('You have not selected a valid subscriber to delete')
              return null
            }
        }

        if (subscriptioncomponent=='data'){
          var sel = this.getSelectionOption(subscriptioncomponent)
          if (sel ===`Select to edit or view ${this.airtimesubscriptions.data.length} active subscribers`){
            alert('You have not selected a valid subscriber to delete')
            return null
          }
        }

        if (subscriptioncomponent=='cable'){
          var sel = this.getSelectionOption(subscriptioncomponent)
          if (sel ===`Select to edit or view ${this.airtimesubscriptions.data.length} active subscribers`){
            alert('You have not selected a valid subscriber to delete')
            return null
          }
        }

        if (subscriptioncomponent=='power'){
          var sel = this.getSelectionOption(subscriptioncomponent)
          if (sel ===`Select to edit or view ${this.airtimesubscriptions.data.length} active subscribers`){
            alert('You have not selected a valid subscriber to delete')
            return null
          }
        }
        
        console.log('Are you sure you want to delete this subscriber ? ',sel)
        var confirmation = confirm('Are you sure you want to delete this subscriber ?\n\n '+sel)
        if (confirmation){console.log("Deleting subscriber record for ", sel);this.defaultDisabled(this.airtimeElementsToDefault);this.resetEditmode(subscriptioncomponent)}
        else{console.log("Delete operation aborted ")}
    }

    private getFieldsToActivate(subscriptioncomponent){
      let subscriptioncomponentIDS = {'airtime':this.airtimeElementsToDefault,'data':this.dataElementsToDefault,
                                      'cable':this.cableElementsToDefault,'power':this.electricityElementsToDefault
                                    }
          console.log("Activating fields ", subscriptioncomponentIDS[subscriptioncomponent])
      return subscriptioncomponentIDS[subscriptioncomponent]

    }

    public EditMode(subscriptioncomponent){

        switch(subscriptioncomponent) {
            case 'airtime':
              return this.editMode
            case 'data':
              return this.dataeditMode
            case 'cable':
              return this.cableeditMode
              case 'power':
                return this.powereditMode

            default:
              // code block
            }
      
    }

    public CreateMode(subscriptioncomponent){
        switch(subscriptioncomponent) {
          case 'airtime':
            return this.createMode
          case 'data':
            return this.datacreateMode
          case 'cable':
            return this.cablecreateMode
            case 'power':
              return this.powercreateMode

          default:
            // code block
          }
    }

    public activate(subscriptioncomponent:string,subscriptiondata,mode:any,id){
      var forms ;
      var count = $("#genericperiodiccomponent").siblings().length;
      console.log("Components present in DOM at edit time ",count);
      if (count == 2){
        this.utilityService.setTodisableElements('cableform')
        this.utilityService.setTodisableElements('powerform')
        console.log()
        forms = ['airtimeform','dataform']
      }
      
      if (count == 3){
        this.utilityService.setTodisableElements('powerform')
      }

      if (count == 4){
        forms = ['airtimeform','dataform','cableform','powerform']
      }
      
      console.log("Init arguments ",subscriptioncomponent,subscriptiondata,mode,id )
      this.airtimesubscriptions = subscriptiondata //***********BUG************
      let Elements = this.getFieldsToActivate(subscriptioncomponent)
      var flag:boolean = false;
      var sel = this.getSelectionOption(subscriptioncomponent)
      if (mode=='editmode'){
        this.resetCreatemode(subscriptioncomponent)
          if (sel ===`Select to edit or view ${subscriptiondata.data.length} active subscribers`){
            this.resetCreatemode(subscriptioncomponent)
            // document.getElementById('createmodediv').style.display = "none";  
              alert('You have not selected a valid subscriber to Edit')
              return null
          }
          else{
              document.getElementById(`${subscriptioncomponent}editlink`).style.pointerEvents = "none";
              for (let form in forms){
                if (!forms[form].includes(subscriptioncomponent)){
                  console.log('The form ',forms[form])
                  this.utilityService.disableElementsAndChildren(forms[form])
                }
              }
              console.log(">>>>>>>>>>>>>>>>>>>>>>>>> ",Elements)
              for (let element in Elements){

                if (!Elements[element].includes('network_label') && !Elements[element].includes('disco_label')){
                  let el:any = document.getElementById(Elements[element]);
                  el.style.opacity = 1;
                  el.style.pointerEvents = "auto";
                  let selector = String(Elements[element].split("network")[0])
                }
              else{
                var elid:any
                if (subscriptioncomponent !='power'){elid = document.getElementById(`${subscriptioncomponent}network_label`)}
                if (subscriptioncomponent =='power'){elid = document.getElementById(`${subscriptioncomponent}disco_label`)}
                elid.placeholder="Labels cannot be edited...."
              }
   
            }
            this.setEditmode(subscriptioncomponent)
            // document.getElementById(id).innerHTML = `Editing ${sel.replace(/\s{2,}/g, ' ')}`
            document.getElementById('modalactionheader').innerHTML = ` ${titleCase(subscriptioncomponent)}: Editing ${String(sel).replace(/\s{2,}/g, ' ')}`
            // document.getElementById(id).style.color = 'rgb(52, 221, 26)'
            // document.getElementById(id).style.fontSize = '16px'
            this.utilityService.enableElementsAndChildren(`${subscriptioncomponent}form`,true)

          }
      }
      else{

          for (let form in forms){
            if (!forms[form].includes(subscriptioncomponent)){
                console.log('The form ',forms[form])
                this.utilityService.disableElementsAndChildren(forms[form])
            }
          }
          if (subscriptioncomponent=='airtime'){document.getElementById('activatediv').style.display = "none";  }
          if (subscriptioncomponent=='data'){document.getElementById('dataactivatediv').style.display = "none";  }
          if (subscriptioncomponent=='cable'){document.getElementById('cableactivatediv').style.display = "none";  }
          if (subscriptioncomponent=='power'){document.getElementById('poweractivatediv').style.display = "none";  }

          for (let element in Elements){

              let el:any = document.getElementById(Elements[element]);
              el.style.opacity = 1;
              el.style.pointerEvents = "auto";
              if (!flag){
                  if (Elements[element].includes('airtime') || Elements[element].includes('data')){
                    let selector = String(Elements[element].split("network")[0])
                    console.log("The selector ", `${selector}editbtn`)
                    // document.getElementById(`${selector}editbtn`).innerHTML = "Save new subscriber";
                    this.setCreatemode(subscriptioncomponent)
                    this.createModeStyles(`${selector}editlink`,'Creating a new subscriber')
                    flag = true;
                }
      
                if (Elements[element].includes('cable')){
                    // document.getElementById(`cableeditbtn`).innerHTML = "Save new IUC number"; 
                    this.setCreatemode(subscriptioncomponent) 
                    this.createModeStyles(`${subscriptioncomponent}editlink`,'Creating a new subscriber')
                }
      
                if (Elements[element].includes('power')){
                  // document.getElementById(`discoeditbtn`).innerHTML = "Save new meter Number";
                  this.setCreatemode(subscriptioncomponent)  
                  this.createModeStyles(`${subscriptioncomponent}editlink`,'Creating a new subscriber')
              }
            }
            this.utilityService.enableElementsAndChildren(`${subscriptioncomponent}form`,true)

          }
        
      }
      
      console.log("Create mode ", this.createMode)
      flag = false
      try{
        // document.getElementById('createmodediv').style.display = "block";  
        if (subscriptioncomponent=='airtime'){document.getElementById('createmodediv').style.display = "block";  }
        if (subscriptioncomponent=='data'){document.getElementById('datacreatemodediv').style.display = "block";  }
        if (subscriptioncomponent=='cable'){document.getElementById('cablecreatemodediv').style.display = "block";  }
        if (subscriptioncomponent=='power'){document.getElementById('powercreatemodediv').style.display = "block";  }
      }
      catch(err:any){
    
      }
      
    }
    
    public onSubmit(subscriptionForm:any,subscriptioncomponent,mode): Observable<any> {
        var subject = new Subject<any>();
        console.log("+++++++++++++++ mode ", mode)
        this.form = subscriptionForm
        let data:any = {}
        this.values = this.form.value
        this.values = this.values
        this.values['mode'] = mode
        console.log(this.values)

        if (mode == 'createMode'){
          let Newsub = this.saveNewSubscriber(subscriptioncomponent,this.values)
          .subscribe((r)=>{
            console.log('Return from create observables ',r)
            Newsub = r
            subject.next(Newsub)
        
          })
        
        }
        if (mode == 'editMode'){
          let Editsub = this.saveChanges(subscriptioncomponent,this.values)
          .subscribe((r)=>{
            console.log('Return from edit observables ',r)
            Editsub = r
            subject.next(Editsub)
        
          })
        } 

        return subject.asObservable();
        
    }

    public getDataPlans(){console.log('+++++++++++++ ',this.Dataplans); return this.Dataplans}

    public onOptionsSelected(value:string,service:string): Observable<any>{
      console.log("the selected value is " + value);
      if (service=='data'){return this.utilityService.getDataSubscription(Number(value.split(',').pop()))}
      if (service=='cable'){return this.utilityService.getCabletvBouquets(Number(value.split(',').pop()))}
        
      }
    
    private setEditmode(subscriptioncomponent){

      if (subscriptioncomponent=='airtime'){return this.editMode = true;}
      if (subscriptioncomponent=='data'){return this.dataeditMode = true;}
      if (subscriptioncomponent=='cable'){return this.cableeditMode = true;}
      if (subscriptioncomponent=='power'){return this.powereditMode = true;}

    }

    private resetEditmode(subscriptioncomponent){

      if (subscriptioncomponent=='airtime'){return this.editMode = false;}
      if (subscriptioncomponent=='data'){return this.dataeditMode = false;}
      if (subscriptioncomponent=='cable'){return this.cableeditMode = false;}
      if (subscriptioncomponent=='power'){return this.powereditMode = false;}

    }

    private setCreatemode(subscriptioncomponent){

      if (subscriptioncomponent=='airtime'){return this.createMode = true;}
      if (subscriptioncomponent=='data'){return this.datacreateMode = true;}
      if (subscriptioncomponent=='cable'){return this.cablecreateMode = true;}
      if (subscriptioncomponent=='power'){return this.powercreateMode = true;}

    }

    private resetCreatemode(subscriptioncomponent){

      if (subscriptioncomponent=='airtime'){return this.createMode = false;}
      if (subscriptioncomponent=='data'){return this.datacreateMode = false;}
      if (subscriptioncomponent=='cable'){return this.cablecreateMode = false;}
      if (subscriptioncomponent=='power'){return this.powercreateMode = false;}

    }

    public resetSubscriptionModes(){
      this.createMode = false;
      this.editMode = false;

      this.datacreateMode = false;
      this.dataeditMode = false;

      this.cablecreateMode = false;
      this.cableeditMode = false;

      this.powercreateMode = false;
      this.powereditMode = false;
    }

    private resetAllEditmode(){

       this.editMode = false;
       this.dataeditMode = false;
       this.cableeditMode = false;
       this.powereditMode = false;

    }

}


