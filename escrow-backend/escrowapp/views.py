import os,json
import logging
from uuid import uuid4
import uuid, time
from django.db.models import Q
from django.db import transaction
from rest_framework.response import Response
from authentication.models import Users
from mail_helper import Mailservice
from middlewares.middleware import JWTAuthenticationMiddleWare
from .models import Order, Transactions, VendorPaymentpool
from .serializers import OrderInstanceSerializer
from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination
from escrowbot.custompagination import CustomPaginatorClass
import stripe
from sms_helper import send_sms
from django.core.paginator import Paginator
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
ESCROW_FEE = os.getenv('ESCROW_FEE')

"""Initializations"""
stripe.api_key = STRIPE_API_KEY


class OrderView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    pagination_class = LimitOffsetPagination
    
    def makeSearchParamString(self,obj):
        return '&'+str(obj).replace('{','').replace('}','').replace(':','=').replace("['",'').replace("']",'').replace("'",'').replace(",",'&').replace(" ",'')
    
    def post(self,request):
        data = request.data
        if Users.objects.filter(email=data['data']['seller_email']).exists:
            data['data']['order_public_id'] = str(uuid.uuid4())
            new_order= Order.objects.create(**data['data'])
            order_instance = new_order
            if order_instance.id:
                response = {"status":True,
                            "message":"New order intent was created!",
                            "data":order_instance.order_public_id,
                            }
                mail_data = {"subject":'New Transaction Initiated!',"recipient":[request.user.email,data['data']['seller_email']],"order_id":order_instance.order_public_id,"ir_template":'new_transaction_template'}
                Mailservice.send_outwards_mail(mail_data)
                buyer_sms_data = {'from': 'Swift Escrow', 'to': request.user.phone, 'text': f'A new transaction with you as a party was initiated with ID {order_instance.order_public_id}'}
                seller_sms_data = {'from': 'Swift Escrow', 'to':  Users.objects.get(email=data['data']['seller_email']).phone, 'text': f'A new transaction with you as a party was initiated with ID {order_instance.order_public_id}'}
                send_sms(buyer_sms_data)
                send_sms(seller_sms_data)
            else:
                response = {"status":False,"message":"New order intent could not be created!"}
                
        else:
            response = {"status":False,"message":"This vendor does not exist!"}
        return Response(response)
            
    def get(self,request):
        time.sleep(3)
        is_search = False
        q = request.GET.get('q', None)
        q_offset = int(request.GET.get('offset', 1))  # Convert q_offset to an integer
        dropdownfilter = request.GET.get('filter')
        self.custom_paginator = CustomPaginatorClass(OrderView.pagination_class,request)
        
        if not q:
            order_intent = Order.objects.filter(buyer_email=request.user.email).filter(payment_received=True).order_by('-created_at')
        else:
            is_search = True
            if dropdownfilter == 'false':
                _filter = (Q(seller_email__icontains=q) | Q(description__icontains=q) | Q(order_public_id__icontains = q)) & Q(buyer_email=request.user.email)
            elif dropdownfilter == 'true':
                _filter = (Q(status__iexact=q)) & Q(buyer_email=request.user.email)
            order_intent = Order.objects.filter(_filter).filter(payment_received=True).order_by('-created_at')
            
        order_intent_count = order_intent.count()
        if order_intent:
            try:
                page_size = self.pagination_class.default_limit
                paginator = Paginator(order_intent, page_size)
                # Ensure the q_offset is within the valid range of pages
                q_offset = max(1, min(q_offset, paginator.num_pages))
                
                order_intent = paginator.page(q_offset)
                
                response = self.custom_paginator.paginate_queryset(order_intent)
                response = self.custom_paginator.get_paginated_response(order_intent)
                data = response.data
                response.data["status"] = True
                response.data["message"] = "Fetched orders intent successfully!"
                response.data["data"] = response.data.pop('results')
                response.data["count"] = order_intent_count
                response.data["is_search"] = is_search
                if len(request.GET.keys()) > 0 and is_search:
                    params = dict(request.GET)
                    try:
                        params.pop('limit')
                        params.pop('offset')
                    except:
                        pass
                    response.data["query"] = self.makeSearchParamString(params)
                total_pages = (order_intent_count + page_size - 1) // page_size
                
                
                orders = []
                # Update pagination information in the response
                offset = (q_offset - 1) * page_size
                response.data['last'] = f'http://127.0.0.1:8000/api/v1/orders?limit={page_size}&offset={total_pages}'
                for _ in dict(data)['data'].object_list:
                    _.__dict__.pop('_state')
                    orders.append(_.__dict__)
                response.data["data"] =  orders
                return response
                
            except Exception as e:
                response = {"status": False, "message": "Could not fetch order intent successfully!"}
        else:
            response = {"status": False, "message": "Could not fetch order intent successfully!"}
        
        return Response(response)
    
    def put(self,request):
        
        data = request.data
        order = Order.objects.filter(order_public_id=data['order_public_id'])
        if order:
            if order.values('status')[0]['status'] == 'completed':
                with transaction.atomic():
                    if order: 
                        order.update(is_buyer_approved=True)
                        vendor = Users.objects.get(email=order.values('seller_email')[0]['seller_email'])
                        order = order.values('order_public_id','agreed_price','status','seller_email')[0]
                        status = self.queue_vendor_payment_intent(order,vendor)
                        if status:
                            msg = f"You have requested vendor settlement successfully!"
                            response = {"status":True,"message":msg}
                            order_id = order.get("order_public_id")
                            seller_sms_data = {'from': 'Swift Escrow', 'to':  Users.objects.get(email=order['seller_email']).phone, 'text': f'Your payment has been approved by {request.user.email} on order with ID {order_id}'}
                            send_sms(seller_sms_data)
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
    def get(self,request):
        return Response({"status":True,"data":{"escrow_fee":float(ESCROW_FEE)}})
  
class TransactionView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def post(self,request):
        msg = ''
        data = request.data
        success = request.GET.get('status',False)
        data = {
                    'order':Order.objects.get(order_public_id=data.get('order_public_id')),
                    'transaction_ref':data.get('reference','GOOGLE_PAY'),
                    'transaction':data['transaction']
                }
        
        
        data['order'].payment_received = data['transaction']['status']
        data['order'].save()
        if Order.objects.filter(order_public_id=data.get('order_public_id')).exists():
            msg = "Transaction was updated!"
            if data.get('channel') == 'paystack':
                Transactions.objects.filter(transaction_ref = data.get('transaction').get('reference')).update(**data)
            elif data.get('channel') == 'google_pay':
                pass
        else:
            msg = "Transaction was created!"
            Transactions.objects.create(**data) 
        
        return Response({"status":True,"message":msg})
    
class MerchantOrderView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    pagination_class = LimitOffsetPagination
    
    def makeSearchParamString(self,obj):
        return '&'+str(obj).replace('{','').replace('}','').replace(':','=').replace("['",'').replace("']",'').replace("'",'').replace(",",'&').replace(" ",'')
    
    def get(self, request):
        time.sleep(3)
        is_search = False
        q = request.GET.get('q', None)
        q_offset = int(request.GET.get('offset', 1))
        dropdownfilter = request.GET.get('filter')
        self.custom_paginator = CustomPaginatorClass(MerchantOrderView.pagination_class, request)
        
        if not q:
            order_intent = Order.objects.filter(seller_email=request.user.email, payment_received=True).order_by('-created_at')
        else:
            is_search = True
            if dropdownfilter == 'false':
                _filter = (Q(buyer_email__icontains=q) | Q(description__icontains=q) | Q(order_public_id__icontains=q)) & Q(seller_email=request.user.email)
            elif dropdownfilter == 'true':
                if q == 'approved' or q == 'pending':
                    _filter = (Q(is_buyer_approved=q=='approved')) & Q(seller_email=request.user.email)
                else:
                    _filter = (Q(status__iexact=q)) & Q(seller_email=request.user.email)
            order_intent = Order.objects.filter(_filter, payment_received=True).order_by('-created_at')
        
        order_intent_count = order_intent.count()
        
        if order_intent:
            try:
                page_size = self.pagination_class.default_limit
                paginator = Paginator(order_intent, page_size)
                
                # Ensure the q_offset is within the valid range of pages
                q_offset = max(1, min(q_offset, paginator.num_pages))
                
                order_intent = paginator.page(q_offset)
                response = self.custom_paginator.paginate_queryset(order_intent)
                response = self.custom_paginator.get_paginated_response(order_intent)
                data = response.data
                response.data["status"] = True
                response.data["message"] = "Fetched merchant orders intent successfully!"
                response.data["data"] = response.data.pop('results')
                response.data["count"] = order_intent_count
                response.data["is_search"] = is_search
                if len(request.GET.keys()) > 0 and is_search:
                    params = dict(request.GET)
                    try:
                        params.pop('limit')
                        params.pop('offset')
                    except:
                        pass
                    response.data["query"] = self.makeSearchParamString(params)                
                total_pages = (order_intent_count + page_size - 1) // page_size
                
                
                orders = []
                # Update pagination information in the response
                offset = (q_offset - 1) * page_size
                response.data['last'] = f'http://127.0.0.1:8000/api/v1/merchant-orders?limit={page_size}&offset={total_pages}'
                for _ in dict(data)['data'].object_list:
                    _.__dict__.pop('_state')
                    orders.append(_.__dict__)
                response.data["data"] =  orders
                return response
                
            except Exception as e:
                response = {"status": False, "message": "Could not fetch order intent successfully!"}
                
        else:
            response = {"status": False, "message": "Could not fetch order intent successfully!"}
        
        return Response(response)

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