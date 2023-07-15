import pprint
import random
from django.contrib.auth import get_user_model
from mail_helper import Mailservice
from middlewares.middleware import JWTAuthenticationMiddleWare
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.db.models import Q
from escrowapp.models import Order,VendorPaymentpool
from django.db import transaction
from datetime import datetime
from .models import Users
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser

profile_values =['firstname',
        'surname',
        'othername',
        'email',
        'phone',
        'accountno',
        'bankname',
        'country',
        'regdate',
        'username',
        'transaction_pin_enabled'
            ]

class RegisterUserAPIView(APIView):
    def post(self, request):
        User = get_user_model()

        # Get username, email and password from request data
        # username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate input data
        if not email or not password:
            return Response({'error': 'Please provide username, email and password.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user with same username or email already exists
        if  User.objects.filter(email=email).exists():
            return Response({'error': 'User with same username or email already exists.'}, status=status.HTTP_409_CONFLICT)

        # Create new user
        Users.create_user(**request.data)

        # Return success response
        return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user is not None:
            # Generate JWT token
            token_payload = {
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(days=7),
                'iat': datetime.utcnow()
            }
            token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')

            # Return success response with JWT token
            return Response({'status':True,
                             'token': token,
                             'username':user.username,
                             'uid':user.id,
                             'two_fa':user.transaction_pin_enabled,
                             'is_vendor':user.is_vendor,
                             'subscription_type':user.subscription_type}, status=status.HTTP_200_OK)
        else:
            # Return error response
            return Response({'status':False,'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
             
class UserProfileView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        # Authenticate user
        user = Users.objects.filter(email=request.user.email).values(*profile_values).first()
        if user is not None:
            # Return success response with JWT token
            return Response({'status':True,'data':user}, status=status.HTTP_200_OK)
        else:
            # Return error response
            return Response({'status':False,'error': 'User was not found!'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request):
        profile_data = request.data.get('profile_data')
        update = Users.objects.filter(email=request.user.email).update(**profile_data)
        if update > 0:
            return Response({'status':True,'data':profile_data['username']}, status=status.HTTP_200_OK)
        else:
            # Return error response
            return Response({'status':False,'error': 'Update failed!'})
        
    def post(self,request):
        transaction_pin_enabled = request.data
        print(transaction_pin_enabled,transaction_pin_enabled)
        update = Users.objects.filter(email=request.user.email).update(**transaction_pin_enabled)
        if update > 0:
            return Response({'status':True,'data':'Action was successful'}, status=status.HTTP_200_OK)
        else:
            # Return error response
            return Response({'status':False,'error': 'Update failed!'})
        
class MerchantProfileView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        merchant = request.GET.get('merchant')
        user = Users.objects.filter(email=merchant).values(*profile_values).first()
        if user is not None:
            return Response({'status':True,'data':user}, status=status.HTTP_200_OK)
        else:
            return Response({'status':False,'error': 'User was not found!'}, status=status.HTTP_404_NOT_FOUND)
            
class OtpView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    
    def get(self,request):
        otp = random.randint(100000,999999)
        data = {"subject":'Vendor Payment OTP Code',"recipient":[request.user.email],"otp_code":otp,"ir_template":'otp_code_template'}
        Mailservice.send_outwards_mail(data)
        Users.objects.filter(email=request.user.email).update(otp=otp,otp_timestamp=datetime.now(timezone.utc))
        return Response({'status':True,'message':'Please enter the code sent to your email account'})
    
    def put(self,request):
        
        user = Users.objects.filter(email=request.user.email).values('otp','otp_timestamp').first()
        if self.check_otp_expiration(user['otp_timestamp']) and user['otp'] == int(request.data['otp_code']):
            return self.pay_vendor(request)
        else:
            return Response({'status':False,'message':'OTP Code has expired!'})
        
    
    def check_otp_expiration(self,start_time):
        seconds_past = self.date_diff_in_Seconds(datetime.now(timezone.utc), start_time)
        if seconds_past > 180: #3 minutes expiration
            return False
        return True
        
    def date_diff_in_Seconds(self,dt2, dt1):
        timedelta = dt2 - dt1
        return timedelta.days * 24 * 3600 + timedelta.seconds
    
    def pay_vendor(self,request):
        
        data = request.data
        order = Order.objects.filter(order_public_id=data['order_public_id'])
        if order:
            if order.values('status')[0]['status'] == 'completed':
                with transaction.atomic():
                    if order: 
                        order.update(is_buyer_approved=True)
                        vendor = Users.objects.get(email=order.values('seller_email')[0]['seller_email'])
                        order = order.values('order_public_id','agreed_price')[0]
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
                response = {"status":False,"message":'Vendor must first mark this order as completed!'}
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
    
class CheckUserExists(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def post(self,request):
        if Users.objects.filter(email=request.data['email']).exists():
            response = {"status":True}
        else:
            response = {"status":False}
        
        return Response(response)

class MakeUserVendorView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def post(self,request):
        
        msg = ''
        data = request.data
        new_data = {'is_vendor':True,
                    'subscription_type':data.get('plan'),
                    'vendor_registration_amount':data.get('transaction')['data']['amount'],
                    'current_subscription_transaction':data.get('transaction')
                    }
        
        if data.get('transaction')['data']['status']=='success':
            msg = f"Your {data.get('plan')} subscription was successfull!"
            Users.objects.filter(email = request.user.email).update(**new_data)
            return Response({"status":True,"message":msg})
        
        else:
            return Response({"status":True,"message":'Your payment has not yet been received!'})
    