import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VerifyPayment } from './../services/verifypayment';
import { UtilityService } from './../services/utility.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../services/cart.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlertComponent } from '../alert/alert.component';
import { Router } from '@angular/router';
declare function payWithPaystack(): any;
declare function myfunction(): any;
let PaystackPop:any
// let utilityservice = UtilityService
export interface CartItems {
  service: string;
  provider: string;
  recipient: string;
  servicename: string;
  amount: string;
  action:any;

}


@Component({
  selector: 'app-paystack',
  templateUrl: './paystack.component.html',
  styleUrls: ['./paystack.component.css']
})
export class PaystackComponent implements OnInit {
  public data = 100
  public paymentdata:any;
  public cart:any; 
  public carttotal:any = '0.00'
  public transactions:CartItems[] = [
    {service:"---",provider:"---",recipient:"---",servicename:"---", amount:"---", action:"---"},
    {service:"---",provider:"---",recipient:"---",servicename:"---", amount:"---", action:"---"},
    {service:"---",provider:"---",recipient:"---",servicename:"---", amount:"---", action:"---"},
    ]
  

  public displayedColumns:string[] = ['service', 'provider', 'recipient', 'servicename', 'amount', 'action'];
  public dataSource:any = new MatTableDataSource<CartItems>(this.transactions);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private cartservice: CartService, 
    private httpclient:HttpClient,
    private utilityservice: UtilityService, 
    private alertcomponent: AlertComponent,
    private router: Router) { 
    
  }
 

  ngOnInit(): void {
    
      this.paymentdata = this.getPaymentDetails()
      this.paymentdata = JSON.parse(this.paymentdata)
      this.cart = this.getcart().cart;
      
      this.cart = JSON.parse(this.cart.cart)
      this.carttotal = this.cart.total
      this.cart = this.cart.cartitems

      if (this.getcart().status){
        this.cart = Object.values(this.cart)
        this.dataSource.data = this.cart
        console.log("converted cart ", this.cart)
      }
      
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    PaystackPop = (<any>window).PaystackPop;
    console.log("Component ",PaystackPop)
  }

  

  private getPaymentDetails(){
    
    // this.carttotal = this.cartservice.getcart().cart as string
    // this.carttotal = this.cart.total
    // console.log('Cart Total ',this.carttotal)
    this.cart = this.getcart().cart;
    this.cart = JSON.parse(this.cart.cart)
    this.carttotal = this.cart.total
    //Update paymentdata amount///////////////////////
    let raw_pay_data:any = window.sessionStorage.getItem('paymentdata') as string  
    raw_pay_data = JSON.parse(raw_pay_data)
    console.log("Raw data ", Object.keys(raw_pay_data)[1], typeof raw_pay_data)
    raw_pay_data[`${Object.keys(raw_pay_data)[1]}`] = this.carttotal + "00"
    console.log("Modified payment data ", raw_pay_data)
    window.sessionStorage.setItem('paymentdata',JSON.stringify(raw_pay_data))
    
    return window.sessionStorage.getItem('paymentdata')
  }

  public deleteFromCart(uid:any){
    console.log("Delete from cart ", uid)
    let response:any = this.cartservice.deletefromcart(uid)
    console.log("response ",response)

    if (response.status){
      console.log('[Cart Delete] ===> ', response.msg)
      this.refreshcart()
      myfunction()

    }
        
    else{ }
   
  }

  private isObjectEmpty(obj:any) {
    return Object.keys(obj).length === 0;
}

  public refreshcart(){

      this.paymentdata = this.getPaymentDetails()
      this.paymentdata = JSON.parse(this.paymentdata)
      this.cart = this.getcart().cart;
      
      this.cart = JSON.parse(this.cart.cart)
      this.carttotal = this.cart.total
      this.cart = this.cart.cartitems
      console.log("Cart after deletion ", this.cart)
      let cartisempty = this.isObjectEmpty(this.cart)
      if (cartisempty){
        console.log("Deleted cart from storage")
        this.cart = []
        window.sessionStorage.removeItem("cart")
        return null
      }
      // window.sessionStorage.setItem("cart",JSON.stringify({cart_reference:cart_reference,total:amount-deductamount, cartitems:cartRest}))

      if (this.getcart().status){
        this.cart = Object.values(this.cart)
        console.log("converted cart ", this.cart)
      }
      return null
  }

  public checkout(){
    var subject = new Subject<string>();
    this.cartservice.checkout().subscribe((payload: any | undefined) => {
          console.log('Checking out',payload)
          // payload = JSON.parse(payload)
          subject.next(payload.status)
          
        });
        return subject
  }

  public getcart(){
    if (this.cartservice.getcart().status){
      return {status:true, cart:this.cartservice.getcart()}
    }
    else{
      return {status:false}
    }
    
  }

  public async callpayWithPaystack(){
     let status = await payWithPaystack()
     if (status){
       await this.alertcomponent.showalert("Your payment was received and your order fufilled")
       this.refreshcart()
       window.sessionStorage.removeItem("cart")
       this.router.navigate(['/airtime']);
     }
  }

  public getcartref(){
    try{
      let data:any = window.sessionStorage.getItem("cart")
      // data = JSON.parse(data)
      console.log("Cart ref ",data.cart_reference)
      return data.cart_reference

    }
    catch (err:any){
      console.log(err)
    }
    
}

public payWithPaystack() {
    this.checkout().subscribe((status: any | undefined) => {
      console.log('Checking out',status)
      if (status){

        let data:any = window.sessionStorage.getItem("paymentdata")
        data = JSON.parse(data)
        
        console.log("Payment data objectss ", data)
        var handler = PaystackPop.setup({ 
            key: 'pk_test_61f9d0b56eef3ea3009d927bd82e71b57405957f', //put your public key here
            // key:'pk_live_8eed2192654877caff4f8679229f884e1b93c35f',
            email: data.email, //put your customer's email here
            amount: data.amount, //amount the customer is supposed to pay
            metadata: {
                custom_fields: [
                    {
                        display_name: "Mobile Number",
                        variable_name: "mobile_number",
                        value: data.phone //customer's mobile number
                    }
                ]
            },
            callback: function (response:any) {
                //after the transaction have been completed
                //make post call  to the server with to verify payment 
                //using transaction reference as post data
                let cart_reference;
                try{
                  let data:any = window.sessionStorage.getItem("cart")
                  data = JSON.parse(data)
                  cart_reference= data.cart_reference
            
                }
                catch (err:any){
                  console.log(err)
                }
                console.log("The cart ref ",cart_reference)
                console.log("The paystack resposne ", response)
                let reference = response.reference
                let orderRef = data.orderRef
                let responseobservable:any
                // let utilityservice = UtilityService
                // console.log("The utiliy service ",utilityservice)
                // try{
                //   // responseobservable = utilityservice.prototype.verifyPayment(reference,orderRef,cart_reference)
                //   responseobservable = VerifyPayment.prototype.verifyPayment(reference,orderRef,cart_reference)
                // }
                // catch(err:any){
                //     console.log(err)
                // }
                
                // console.log("Response observable ",responseobservable)
                // responseobservable.subscribe({
                //   next:(backendresponse:any) => {
                //     // payload = JSON.parse(payload)
                //     console.log("Deletion status ",backendresponse)
                //   //   if (payload.status){
                //   //     console.log('[Cart Delete] ===> ', response.msg)
                //   //     this.refreshcart()
                //   // }
                        
                //   //   else{ }
                //   },
                //   error:(err: { error: { msg: string; }; }) => { alert("msg")}
                // });
                // .then((backendresponse:any)=>{
                //   console.log("Backend response ", backendresponse)
    
                // })
               
                $.post("http://localhost:8000/api/v1/payment/verify", {reference:reference,orderRef: orderRef,cart_reference:cart_reference}, function(response:any){
                    console.log("Big status ", response)
                    if(response.status ){
                         //successful transaction
                         window.sessionStorage.removeItem("cart")
                         alert('Transaction was successful '+ response.message);
                         window.location.replace("http://localhost:4200/cart");
    
                    }
                       
                    else
                        //transaction failed
                        alert(response.message);
                });
            },
            onClose: function () {
                //when the user close the payment modal
                alert('Transaction cancelled');
            }
        });
        handler.openIframe(); //open the paystack's payment modal


      }

      
    });
    

}

}
