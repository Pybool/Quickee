import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaystackService {
  private paystackPublicKey = environment.TEST_PAYSTACK_PUBLIC_KEY;

  constructor(private http: HttpClient) {
    // Initialize Paystack library
    this.initializePaystack();
  }

  private initializePaystack() {
    // Include Paystack JavaScript library
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    document.head.appendChild(script);
  }

  public initiatePayment(amount: number, email: string, callback: (response: any) => void) {
    // Call Paystack inline method to initiate payment
    const handler = (window as any).PaystackPop.setup({
      key: this.paystackPublicKey,
      email,
      amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
      callback,
    });

    // Open Paystack payment dialog
    handler.openIframe();
  }

  public verifyTransaction(reference: string, callback: (response: any) => void) {
    // Make an API request to verify the transaction using Paystack API
    // You need to implement this method to send an HTTP request to the Paystack API
    // and pass the transaction reference. The callback function will be called
    // with the response from the API.
    // Example:
    // Make an HTTP POST request to `https://api.paystack.co/transaction/verify/reference`
    // with the appropriate headers and your Paystack secret key.
    // In the callback function, pass the response to the provided callback.

    // Example implementation:
    const apiUrl = `https://api.paystack.co/transaction/verify/${reference}?external=1`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.TEST_PAYSTACK_SECRET_KEY}`
    });
    this.http.get(apiUrl, { headers }).subscribe(callback);
  }
}