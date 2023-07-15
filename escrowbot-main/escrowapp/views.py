import os,json
import logging
from uuid import uuid4
import uuid, time
from django.db.models import Q
from django.db import transaction
from rest_framework.response import Response
from authentication.models import Users
from middlewares.middleware import JWTAuthenticationMiddleWare
from .models import Order, Transactions, VendorPaymentpool
from .serializers import OrderInstanceSerializer
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination
from escrowbot.custompagination import CustomPaginatorClass
import stripe
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
ESCROW_FEE = os.getenv('ESCROW_FEE')

"""Initializations"""
stripe.api_key = STRIPE_API_KEY


class OrderView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    pagination_class = LimitOffsetPagination
    
    def post(self,request):
        data = request.data
        print(data)
        if Users.objects.filter(email=data['data']['seller_email']).exists:
            data['data']['order_public_id'] = str(uuid.uuid4())
            new_order= Order.objects.create(**data['data'])
            order_instance = new_order
            if order_instance.id:
                # order_instance_serializer = OrderInstanceSerializer(order_instance)
                # payment_intent_data = self.create_payment_intent(order_instance.agreed_price,order_instance.description)
                response = {"status":True,
                            "message":"New order intent was created!",
                            "data":order_instance.order_public_id,
                            # 'payment_intent_data':payment_intent_data
                            }
            else:
                response = {"status":False,"message":"New order intent could not be created!"}
        else:
            response = {"status":False,"message":"This vendor does not exist!"}
        return Response(response)
            
    def get(self,request):
        
        q = request.GET.get('q', None)
        dropdownfilter = request.GET.get('filter')
        self.custom_paginator = CustomPaginatorClass(OrderView.pagination_class,request)
        
        if not q:
            print("Executing", request.user.email)
            order_intent = Order.objects.filter(buyer_email=request.user.email).order_by('-created_at')
        else:
            if dropdownfilter == 'false':
                _filter = (Q(seller_email__icontains=q) | Q(description__icontains=q) | Q(order_public_id__icontains = q)) & Q(buyer_email=request.user.email)
            elif dropdownfilter == 'true':
                _filter = (Q(status__iexact=q)) & Q(buyer_email=request.user.email)
            order_intent = Order.objects.filter(_filter).order_by('-created_at')
            
        order_intent_count = order_intent.count()
        order_intent = order_intent.values()
        print(order_intent)
        if order_intent:
            # order_instance_serializer = OrderInstanceSerializer(order_intent,many=True)
            time.sleep(1)
            
            order_intent = self.custom_paginator.paginate_queryset(order_intent)
            response = self.custom_paginator.get_paginated_response(order_intent)
            response.data["status"] = True
            response.data["message"] = "Fetched order intent successfully!"
            response.data["data"] = response.data.pop('results')
            response.data["total_customers"] = order_intent_count
            try:
                page_size = 5
                page_number = round(order_intent_count/int(page_size)) + 1 #if list(total_payments[0].values())[0]%int(page_size) == 1 else round(list(total_payments[0].values())[0]/int(page_size))
                offset = (page_number - 1) * page_size
                print("Offset ----> ",page_number, offset, order_intent_count,response.data['last'])
                # response.data['last'] = dict(response.data)['last'].replace("offset=36",f"offset={41}")
                # print(response.data['last'])
            except Exception as e:
                print(e)
                pass
            
            # response = {"status":True,"message":"Fetched order intent successfully!","data":order_intent.values()}
        else:
            response = {"status":False,"message":"Could not fetch order intent successfully!"}
            return Response(response)
        return response
    
    def put(self,request):
        
        data = request.data
        order = Order.objects.filter(order_public_id=data['order_public_id'])
        if order:
            if order.values('status')[0]['status'] == 'completed':
                with transaction.atomic():
                    if order: 
                        order.update(is_buyer_approved=True)
                        vendor = Users.objects.get(email=order.values('seller_email')[0]['seller_email'])
                        order = order.values('order_public_id','agreed_price','status')[0]
                        status = self.queue_vendor_payment_intent(order,vendor)
                        if status:
                            msg = f"You have requested vendor settlement successfully!"
                            response = {"status":True,"message":msg}
                        else:
                            response = {"status":False,"message":'Something went wrong!'}
                    else:
                        msg = 'Order could not be found!'
                        response = {"status":False,"message":msg}
                    return Response(response)
            else:
                response = {"status":False,"message":'Vendor must first mark this order as completed!','additional_message':"Vendor might have changed the order status"}
                return Response(response)
        else:
            response = {"status":False,"message":'This order does not exist!'}
            return Response(response)
    
    
    def queue_vendor_payment_intent(self,order,vendor):
        print(order)
        
        order_public_id = order['order_public_id']
        vendor_name = vendor.vendor_name()
        vendor_account_no = vendor.accountno
        vendor_email = vendor.email
        vendor_paystack_customer_no = vendor.paystack_customer_no
        settlement_amount = order['agreed_price']
        bankname = vendor.bankname
        
        data = {'order_public_id':order_public_id,
                'vendor_name': vendor_name,
                'vendor_account_no':vendor_account_no,
                'vendor_email': vendor_email,
                'vendor_paystack_customer_no': vendor_paystack_customer_no,
                'settlement_amount': settlement_amount,
                'bankname': bankname
                }
        status = VendorPaymentpool.objects.create(**data)
        return status
      
class OrderMetaDataView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    #Paystack transactions only
    def get(self,request):
        return Response({"status":True,"data":{"escrow_fee":float(ESCROW_FEE)}})
  
class TransactionView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    #Paystack transactions only
    def post(self,request):
        msg = ''
        data = request.data
        data = {
                    'order':Order.objects.get(order_public_id=data.get('order_public_id')),
                    'transaction_ref':data.get('reference'),
                    'transaction':data['transaction']
                }
        if Order.objects.filter(order_public_id=data.get('order_public_id')).exists():
            msg = "Transaction was updated!"
            Transactions.objects.filter(transaction_ref = data.get('transaction').get('reference')).update(**data)
        else:
            msg = "Transaction was created!"
            Transactions.objects.create(**data) 
        return Response({"status":True,"message":msg})
    
class MerchantOrderView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    pagination_class = LimitOffsetPagination
            
    def get(self,request):
        
        q = request.GET.get('q', None)
        dropdownfilter = request.GET.get('filter')
        self.custom_paginator = CustomPaginatorClass(OrderView.pagination_class,request)
        if not q:
            order_intent = Order.objects.filter(seller_email=request.user.email).order_by('-created_at')
        else:
            if dropdownfilter == 'false':
                _filter = (Q(buyer_email__icontains=q) | Q(description__icontains=q) | Q(order_public_id__icontains = q)) & Q(seller_email=request.user.email)
            elif dropdownfilter == 'true':
                _filter = (Q(status__iexact=q)) & Q(seller_email=request.user.email)
            order_intent = Order.objects.filter(_filter).order_by('-created_at')
        
        order_intent_count = order_intent.count()
        order_intent = order_intent.values()
        if order_intent:
            time.sleep(1)
            
            order_intent = self.custom_paginator.paginate_queryset(order_intent)
            response = self.custom_paginator.get_paginated_response(order_intent)
            response.data["status"] = True
            response.data["message"] = "Fetched order intent successfully!"
            response.data["data"] = response.data.pop('results')
            response.data["total_customers"] = order_intent_count
            try:
                page_size = 5
                page_number = round(order_intent_count/int(page_size)) + 1 #if list(total_payments[0].values())[0]%int(page_size) == 1 else round(list(total_payments[0].values())[0]/int(page_size))
                offset = (page_number - 1) * page_size
                print("Offset----> ",page_number, offset, order_intent_count,response.data['last'])
                response.data['last'] = dict(response.data)['last'].replace("offset=36",f"offset={41}")
                print(response.data['last'])
            except Exception as e:
                print(e)
                pass
        else:
            response = {"status":False,"message":"Could not fetch order intent successfully!"}
            return Response(response)
        return response
    
    def put(self,request):
        data = request.data
        order = Order.objects.filter(order_public_id=data['order_public_id'])
        if order: 
            order.update(status=data['status'])
            msg = f"Order marked as {data['status'].title()}!"
            response = {"status":True,"message":msg}
        else:
            msg = 'Order could not be found!'
            response = {"status":False,"message":msg}
        return Response(response)
      

class ReportVendorOrderView(APIView):
    def put(self,request):
        data = request.data
        order = Order.objects.filter(order_public_id=data['order_public_id'])
        if order: 
            order.update(complaints=data['complaint'])
            msg = f"You have made a complaint on this order!"
            response = {"status":True,"message":msg}
        else:
            msg = 'Order could not be found!'
            response = {"status":False,"message":msg}
        return Response(response)
        
class NonCardPaymentsWebhook(APIView):
    
    def post(self,request):
        print("USSD PAYMENT DATA FROM PAYSTACK ---------> ", request.data)
        return Response({"status":True})