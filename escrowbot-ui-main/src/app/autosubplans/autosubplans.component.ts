import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-autosubplans',
  templateUrl: './autosubplans.component.html',
  styleUrls: ['./autosubplans.component.css']
})



export class AutosubplansComponent implements OnInit {

  planForm: FormGroup;
  
  intervals = ['daily','weekly','monthly','bi-monthly']
  categories = ['Airtime','Data','Cable','Electricity']
  constructor(public activeModal: NgbActiveModal,private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.planForm = new FormGroup({
      category: new FormControl(null, [Validators.required,]),
      name: new FormControl(null, [Validators.required,]),
      interval: new FormControl(null, [Validators.required,]),
      amount: new FormControl(null, [Validators.required,]),
      description: new FormControl(null, [Validators.required,]),
    });
  }

  createplan(){

    this.utilityService.newPlan(this.planForm.value).subscribe((response)=>{
      next:(response:any) => {
        if (response.status){
          alert(response.message)
        }
        else{ }
      }
    })
  }

  intervalSelected(val){

  }

  categorySelected(val){

  }

}

