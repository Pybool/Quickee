import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-subscribersmodal',
  templateUrl: './subscribersmodal.component.html',
  styleUrls: ['./subscribersmodal.component.css']
})



export class SubscribersModalComponent implements OnInit {

  subscriberForm: FormGroup;
  @Input() public subscriptions_service;
  customers:any[];
  plans:any[];
  networks:string[] = ['Mtn','9Mobile','Airtel','Glo']

  constructor(public activeModal: NgbActiveModal,private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.subscriberForm = new FormGroup({
      customer: new FormControl(null, [Validators.required,]),
      plan: new FormControl(null, [Validators.required,]),
      network: new FormControl(null, [Validators.required,]),
    });
    this.utilityService.getCustomers().subscribe({
      next:(response:any) => {
        if (response.status){
          this.customers = response.data
        }
        else{ }
      }
    })

    this.utilityService.getPlans(this.subscriptions_service).subscribe({
      next:(response:any) => {
        if (response.status){
          this.plans = response.data
        }
        else{ }
      }
    })


  }

  createSubscriber(){
    
    this.subscriberForm.value['subscriptions_service'] = this.subscriptions_service
    console.log(this.subscriberForm.value)
    this.utilityService.newSubscriber(this.subscriberForm.value).subscribe({
      next:(response:any) => {
        if (response.status){
          alert(response.message)
        }
        else{ alert(response.message) }
      }
    })
  }

  planSelected(val){

  }

  customerSelected(val){

  }

  networkSelected(val){
    
  }

}

