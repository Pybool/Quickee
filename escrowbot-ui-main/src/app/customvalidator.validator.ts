import { CableelectricityService } from './services/cableelectricity.service';
import { FormGroup, AbstractControl } from "@angular/forms";
import { validatePhoneNumberAsync } from "nigeria-phone-number-validator";


// To validate password and confirm password
export function ComparePassword(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

// To validate first name
export function ValidatePhone(control: AbstractControl) {
  if (!control.value.startsWith("@")) {
    return { validFname: true };
  }
  return null;
}

// To validate last name
export function ValidateLastName(control: AbstractControl) {
    if (control.value.length <= 3) {
      return { validLname: true };
    }
    return null;
  }

export function isAirtimeAmountValid(control: AbstractControl) {
var p = control.value
var valid ;
console.log("preeek ", !isNaN(Number(p)), Number.isInteger(Number(p)))
if (!isNaN(Number(p)) && Number.isInteger(Number(p))){
    if (p >= 100){
        valid = true
    }
}


if (!valid){
    console.log("Valid amount ", valid)
    return { validAmount: true };
}
return null;
  
  }

export function isISPValid(control: AbstractControl) {
  const isp = ['MTN','GLO','AIRTEL','ETISALAT']
  var p = control.value
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

export function isSubscriptionAirtimeAmountValid(control: AbstractControl) {
  var p = control.value
  var valid ;
  console.log("preeek ", !isNaN(Number(p)), Number.isInteger(Number(p)))
  if (!isNaN(Number(p)) && Number.isInteger(Number(p))){
      if (p >= 2000){
          valid = true
      }
  }
  
  if (!valid){
      console.log("Valid amount ", valid)
      return { validAmount: true };
  }
  return null;
    
    }

export function isElectricityAmountValid(control: AbstractControl) {
    var p = control.value
    var valid ;
    console.log("preeek ", !isNaN(Number(p)), Number.isInteger(Number(p)))
    if (!isNaN(Number(p)) && Number.isInteger(Number(p))){
        if (p >= 1500){
            valid = true
        }
    }

    if (!valid){
        console.log("Valid amount ", valid)
        return { validAmount: true };
    }
    return null;
    
    }

export function isValidPhone(control: AbstractControl) {
    var p = control.value
    var phoneRe = /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;
    var valid = phoneRe.test(p);
    
    if (!valid){
        // console.log("Valid phones ", valid)
        return { validPhone: true };
    }
    return null;
  
  }

  export function isValidSubscriptionLabel(control: AbstractControl) {
    var p = control.value
    var valid = !((p.length <= 30) && (typeof p == 'string'));
    
    if (!valid){
        // console.log("Valid phones ", valid)
        return { validSubscriptionLabel: true };
    }
    return null;
  
  }

export async function validatePhone(phone:any,formtelco:any=''){

    formtelco = formtelco.split(",")[0]
    try {
      const result:any = await validatePhoneNumberAsync(`${phone}`);
      if (formtelco == ''){
          console.log("No telco args ", phone,result)
          return result.isValid
        
        }
     else{

        console.log(result);
        let telco = result.telco
        let alternatenetwork = ''
        
        if (formtelco.toLowerCase()==='etisalat'){
          alternatenetwork = '9mobile'
          
        }
        console.log(telco.toLowerCase(), formtelco.toLowerCase())
        if (telco.toLowerCase()===formtelco.toLowerCase() || telco.toLowerCase()===alternatenetwork){
          console.log(90000000)
          return true
        }
        else {return false}

     }
     
      // { telco: "MTN", isValid: true }
    } 
    catch (error) {
      // react to error
      console.log()
    }


  }




  