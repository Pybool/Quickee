import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-customersmodal',
  templateUrl: './customersmodal.component.html',
  styleUrls: ['./customersmodal.component.css']
})



export class CustomersModalComponent implements OnInit {

  customerForm: FormGroup;
  intervals = ['daily','weekly','monthly','bi-monthly']
  categories = ['Airtime','Data','Cable','Electricity']
  constructor(public activeModal: NgbActiveModal,private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required,]),
      lastname: new FormControl(null, [Validators.required,]),
      email: new FormControl(null, [Validators.required,]),
      phonenumber: new FormControl(null, [Validators.required,]),
      iuc_number: new FormControl(null),
      meter_number: new FormControl(null),
    });
  }

  createCustomer(){
    console.log(this.customerForm.value)
    this.utilityService.newCustomer(this.customerForm.value).subscribe({
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

