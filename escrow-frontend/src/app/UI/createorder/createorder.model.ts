export interface INewOrder{
    seller_email:string;
    buyer_email:string;
    unitprice:number;
    description?:string;
    image?:any;
    units:number;
    agreedtotal:number;
    escrowfee:number;
    paymentchannel:string;

}

export class NewOrder{
    seller_email:string | undefined;
    buyer_email:string | undefined;
    unit_price:number | undefined;
    description:string | undefined;
    image:any;
    order_units:number| undefined;
    agreed_price:number| undefined;
    escrow_fee:number| undefined;
    payment_channel:string| undefined;

}
