import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TokenstorageService } from './tokenstorage.service';
import { map } from 'rxjs/operators';
let count = 0
@Injectable({
  providedIn: 'root'
})
export class CartService {

  public Cart:any = {};
  public response_api_cart_delete:any;
  constructor(private http:HttpClient, private tokenstorageservice: TokenstorageService) { }

  public cartuid(){

      return'OD'+'-'+ Math.floor(Date.now()/1000);
  }

  public addtocart(cart:any){
      let init_uid = this.cartuid()
      cart['uid'] = init_uid
      this.Cart[this.cartuid()] = cart
      console.log(">>>>>>>>>>>>>>>>>>>>>>...", cart)
      
      let cart_exist:any = window.sessionStorage.getItem('cart')
      if (cart_exist){

        let parsed_cart = JSON.parse(cart_exist)
        let parsed_cart_total = parsed_cart.total
        parsed_cart = parsed_cart.cartitems
        let uid = this.cartuid()
        cart['uid'] = uid
        parsed_cart[`${uid}`] = cart
        // console.log("Compute ", parseFloat(parsed_cart_total) , parseFloat(cart.amount))
    
        let response:any = this.getcart()
        let cart_reference;
        if(response.status){
          response = JSON.parse(response.cart)
          console.log("Response from cart ",response)
          cart_reference = response.cart_reference
        }

        // this.tempfunc().subscribe((payload: any | undefined) => {
        //   console.log('SEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',payload)
        //   if(payload.status){




            
        //   }
        
          
        // });

        parsed_cart_total = parseFloat(parsed_cart_total) + parseFloat(cart.amount)
        console.log("error amount ",parsed_cart_total)
        count++
        console.log("Count ooo",count)
        window.sessionStorage.setItem("cart",JSON.stringify({cart_reference:cart_reference,total:parsed_cart_total, cartitems:parsed_cart}))
        return true
        

      }

      else{
        let cart_reference = 'CR'+'-'+ Math.floor(Date.now()/1000) + this.tokenstorageservice.getUser();
        console.log("Generated cart ref ",cart_reference)
        window.sessionStorage.setItem("cart",JSON.stringify({cart_reference:cart_reference, total:cart.amount, cartitems:this.Cart}))
        return true
        // this.(JSON.stringify({total:cart.amount, cartitems:this.Cart}))
        // console.log("Cart ",cart)

      }
    
  }

  // public tempfunc(){

  //     var subject = new Subject<string>();
  //     // let addcart_response:any = this.checkout()
  //     // addcart_response.subscribe((payload: any | undefined) => {
  //     //     console.log('stage 2',payload)
  //     //     // payload = JSON.parse(payload)
  //     //     subject.next(payload)
          
  //       // });
  //     return subject.asObservable();

  // }

  public checkout(){
      let public_id = String(this.tokenstorageservice.getUser())
      let username = String(this.tokenstorageservice.getUsername())
      let cart:any = this.getcart()
      cart = JSON.parse(cart.cart)
      cart['public_id'] = public_id
      cart['username'] = username.replace(/["]+/g, '') //Remove double quotes from the username string
      cart['flag'] = true
      console.log("Checkout cart ",cart['flag'], cart, typeof cart, username)
      try{

        if (cart['flag']){
          cart['flag'] = false
          var subject = new Subject<string>();
          this.updatebackend(JSON.stringify(cart))
          .subscribe(payload => {
            console.log('stage 1',payload)
            // payload.map((payload: any) => {
        
              console.log("Add cart status ",payload)
              if (payload.status){
                 console.log("Checkout ",payload.status);
                 
                 subject.next(payload);
                
                }
                    
                else{ subject.next(payload); }
              
            });
            return subject.asObservable();
        }
        else{}


      }
      catch(err:any){
        cart['flag'] = true
      }
      
      

  }

  public updatebackend(data:any): Observable<any> {
    
    const httpOptions_jointrx = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("////////////////////////////////", data)
    return this.http.post("http://127.0.0.1:8000/api/v1/add/cart", {data}, httpOptions_jointrx);
  };

  public getcart(){
    if (window.sessionStorage.getItem('cart')){
      return {status:true, cart:window.sessionStorage.getItem('cart')}
    }
    else{
      return {status:false}
    }
    
  }

  public deleteAfterBackendDeleteResponse(uid:any){

    let cart:any = window.sessionStorage.getItem('cart')
    cart = JSON.parse(cart)
    let amount = cart.total
    cart = cart.cartitems
    let deductamount = cart[uid].amount
    let name = ""+uid
    const { [name]: removedProperty, ...cartRest } = cart; // Dynamically remove from object with variable
    console.log("New cart ",cartRest); // { name: 'John Smith' }

    let response:any = this.getcart()
    let cart_reference;
    if(response.status){
      response = JSON.parse(response.cart)
      console.log("Response from cart ",response)
      cart_reference = response.cart_reference
    }
   
    window.sessionStorage.setItem("cart",JSON.stringify({cart_reference:cart_reference,total:amount-deductamount, cartitems:cartRest}))
    console.log({status:true, msg:`Cart item ${uid} successfully removed from cart...`})
    return {status:true, msg:`Cart item ${uid} successfully removed from cart...`}
   
    // console.log("Delete lamb ",cartuid)
    // delete cart[`${uid}`]
    // return window.sessionStorage.remove('cart',uid)


  }

  public deletefromcart(uid:any){
    this.response_api_cart_delete = this.deleteAfterBackendDeleteResponse(uid)
    return this.response_api_cart_delete
  //   var subject = new Subject<string>();
  //   this.deletefromcartdb(uid,this.tokenstorageservice.getUser())
  //   .subscribe(payload => {
  //     console.log(190000,payload)
  //     // payload.map((payload: any) => {
  
  //       console.log("Deletion status ",payload)
  //       if (payload.status){ 
  //           console.log("Cart item was deleted from backend, deletion on frontend can proceed")
  //           this.response_api_cart_delete = this.deleteAfterBackendDeleteResponse(uid)
  //           console.log(this.response_api_cart_delete)
  //           subject.next(this.response_api_cart_delete);

  //       }

  //   }
  // );
  //   return subject.asObservable();

    
    // .pipe(
    //   map((payload: any) => {

    //     console.log("Deletion status ",payload)
    //     if (payload.status){ 
    //         console.log("Cart item was deleted from backend, deletion on frontend can proceed")
    //         this.response_api_cart_delete = this.deleteAfterBackendDeleteResponse(uid)
    //         console.log(this.response_api_cart_delete)
    //         return this.response_api_cart_delete

    //     }
            
    //     else{ }
    //     return payload;
    //   })
    // );

    
    // .subscribe({
    //   next:(payload:any) => {
    //     // payload = JSON.parse(payload)
    //     console.log("Deletion status ",payload.status)
    //     if (payload.status){ 
    //         console.log("Cart item was deleted from backend, deletion on frontend can proceed")
    //         this.response_api_cart_delete = this.deleteAfterBackendDeleteResponse(uid)
    //         console.log(this.response_api_cart_delete)
    //         return this.response_api_cart_delete

    //     }
            
    //     else{ }
    //   },
    //   error:(err: { error: { msg: string; }; }) => { alert("msg")}
    // });
    // console.log(this.response_api_cart_delete,"200_OK")
    // return this.response_api_cart_delete

    
  }

  public deletefromcartdb(item_id:string,buyer_id:string): Observable<any>{

    const httpOptions_delete_cart_item = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    // console.log("The published reservation ",reservation)
    console.log("Delete backend cart item ",{item_id:item_id, buyer_id:buyer_id})
    return this.http.post("http://localhost:8000/api/v1/delete/cartitem", JSON.stringify({item_id:item_id, buyer_id:buyer_id})
    , httpOptions_delete_cart_item);
  }


}

export class CartParser {


  constructor() { }

}
// public getcart(){
//   let raw_cart = window.sessionStorage.getItem('cart') as string;
//   if (raw_cart){
//     console.log("Filtered cart ",JSON.parse(raw_cart).cartitems)
//     return {status:true, cart:JSON.parse(raw_cart).cartitems, total:JSON.parse(raw_cart).total}
//   }
//   else{
//     return {status:false}
//   }
  
// }
