// src/app/payment/payment.component.ts

import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent {
  amount: number = 0;
  // cardHandler:any = null;
  _totalAmount: any;
    card: any;
    @ViewChild('cardInfo') cardInfo: any;
  constructor(private http: HttpClient, private orderService: OrderService) { }

  ngOnInit(){
    // this.loadStripe()
  }

//   ngOnDestroy() {
//     if (this.card) {
//         // We remove event listener here to keep memory clean
//         this.card.removeEventListener('change', this.cardHandler);
//         this.card.destroy();
//     }
// }
ngAfterViewInit() {
    this.initiateCardElement();
}
initiateCardElement() {
    const options = {
        layout: {
          type: 'tabs',
          defaultCollapsed: false,
        }
    };
    const stripe = (window as any).stripe
    console.log(stripe)
    this.orderService.getClientSecret().pipe(take(2)).subscribe((client_secret:any)=>{
      console.log("client_secret ---> ", client_secret)
      this.card = stripe.elements({client_secret:client_secret}).create('card', options);
      this.card.mount('#card-info');
      this.card.addEventListener('change', this.cardHandler);
      const iframe:any = document.querySelector('iframe')
      const iframeWindow:any = iframe.contentWindow;
      const iframeDocument:any = iframeWindow.document
      const form:any= iframeDocument.querySelector('form');
      console.log(form)
      form?.addEventListener('submit', async(event:any)=>{
        event.preventDefault();
        console.log("requesting...")
        stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: this.card,
          }
        }).then((result: any) => {
          if (result.error) {
            Swal.fire({
              position: 'top-start',
              icon: 'error',
              title: `Payment Unuccessfull`,
              text:`Your payment was unsuccessfull!`,
              showConfirmButton: false,
              timer: 3500
            })
          } else {
            Swal.fire({
              position: 'top-start',
              icon: 'info',
              title: `TPayment Successfull`,
              text:`Your payment was successfull!`,
              showConfirmButton: false,
              timer: 3500
            })
          }
        });
      })
    })
    
}

cardHandler(){

}

  createPaymentIntent() {
    const amount = this.amount * 100;  // Stripe expects the amount in cents
    this.http.post('http://127.0.0.1:8000/api/v1/payment-intent/', { amount })
      .subscribe((response: any) => {
        const stripe = (window as any).Stripe('pk_test_51NIUkwJ62yskJ0NJfUjTf1SezTRcNS6MhsFyOyubaiBZI0kMPkkN4XxQMFXFdGrm8PWX78hGEbOMtocFrePPZ8xr00mMgvyWDh');
        
    });
  }

  loadStripe() {
      
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.cardHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }
        
      window.document.body.appendChild(s);
    }
}
}