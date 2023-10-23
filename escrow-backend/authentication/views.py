import pprint
import random
from django.contrib.auth import get_user_model
from mail_helper import Mailservice
from middlewares.middleware import JWTAuthenticationMiddleWare
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from sms_helper import send_sms
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
from .serializers import ImageUploadSerializer

img_base_url = f"http://127.0.0.42:8080/profile_pics/"

profile_values =[
                'firstname',
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
        try:
            User = get_user_model()
            email = request.data.get('email')
            password = request.data.get('password')
            request.data.pop('passwordagain')
            # Validate input data
            if not email or not password:
                return Response({'error': 'Please provide username, email and password.'}, status=status.HTTP_400_BAD_REQUEST)
            if  User.objects.filter(email=email).exists():
                return Response({'error': 'User with same username or email already exists.'}, status=status.HTTP_409_CONFLICT)
            Users.create_user(**request.data)
            return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})

class LoginAPIView(APIView):
    def post(self, request):
        try:
            username = request.data.get('email')
            password = request.data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                token_payload = {
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(days=7),
                    'iat': datetime.utcnow()
                }
                token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')
                return Response(
                    {'status':True,
                    'token': token,
                    'username':user.username,
                    'uid':user.id,
                    'two_fa':user.transaction_pin_enabled,
                    'is_vendor':user.is_vendor,
                    'subscription_type':user.subscription_type
                    }, status=status.HTTP_200_OK
                )
                
            return Response({'status':False,'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
             
class UserProfileView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        try:
            user = Users.objects.filter(email=request.user.email).values(*profile_values).first()
            if user is not None:
                return Response({'status':True,'data':user,'profile_pics':img_base_url + str(Users.objects.filter(email=request.user.email).values('profile_pics').first()['profile_pics'])}, status=status.HTTP_200_OK)
            else:
                return Response({'status':False,'error': 'User was not found!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
        
    def put(self, request):
        try:
            profile_data = request.data.get('profile_data')
            update = Users.objects.filter(email=request.user.email).update(**profile_data)
            if update > 0:
                return Response({'status':True,'data':profile_data['username']}, status=status.HTTP_200_OK)
            else:
                return Response({'status':False,'error': 'Update failed!'})
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
        
    def post(self,request):
        try:
            transaction_pin_enabled = request.data
            update = Users.objects.filter(email=request.user.email).update(**transaction_pin_enabled)
            if update > 0:
                return Response({'status':True,'data':'Action was successful'}, status=status.HTTP_200_OK)
            else:
                # Return error response
                return Response({'status':False,'error': 'Update failed!'})
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})


class UploadProfilePictureView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            image = serializer.validated_data['image']
            image_instance, created = Users.objects.get_or_create(id=request.user.id)
            
            # Update the image field if the record exists
            image_instance.profile_pics = image
            image_instance.save()
            
            user = Users.objects.filter(id=request.user.id)
            user.update(profile_pics=f'{image}')
            
            # Construct the full URL of the uploaded image
            print(user.values().first())
            # http://127.0.0.42:8080/profile_pics/
            image_url = f"http://127.0.0.42:8080/profile_pics/{user.values().first()['profile_pics']}"
            print(image_url)
            return Response({'message': 'Image uploaded successfully','profile_pic':image_url}, status=201)
        else:
            return Response(serializer.errors, status=400)
           
class MerchantProfileView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        try:
            merchant = request.GET.get('merchant')
            user = Users.objects.filter(email=merchant).values(*profile_values).first()
            if user is not None:
                return Response({'status':True,'data':user}, status=status.HTTP_200_OK)
            else:
                return Response({'status':False,'error': 'User was not found!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
            
class OtpView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    
    def get(self,request):
        try:
            otp = random.randint(100000,999999)
            data = {"subject":'Vendor Payment OTP Code',"recipient":[request.user.email],"otp_code":otp,"ir_template":'otp_code_template'}
            Mailservice.send_outwards_mail(data)
            Users.objects.filter(email=request.user.email).update(otp=otp,otp_timestamp=datetime.now(timezone.utc))
            return Response({'status':True,'message':'Please enter the code sent to your email account'})
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
    
    def put(self,request):
        try:
            user = Users.objects.filter(email=request.user.email).values('otp','otp_timestamp').first()
            if self.check_otp_expiration(user['otp_timestamp']) and user['otp'] == int(request.data['otp_code']):
                return self.pay_vendor(request)
            else:
                return Response({'status':False,'message':'OTP Code has expired!'})
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
        
    
    def check_otp_expiration(self,start_time):
        seconds_past = self.date_diff_in_Seconds(datetime.now(timezone.utc), start_time)
        if seconds_past > 180: #3 minutes expiration
            return False
        return True
        
    def date_diff_in_Seconds(self,dt2, dt1):
        timedelta = dt2 - dt1
        return timedelta.days * 24 * 3600 + timedelta.seconds
    
    def pay_vendor(self,request):
        try:
            data = request.data
            order = Order.objects.filter(order_public_id=data['order_public_id'])
            if order:
                if order.values('status')[0]['status'] == 'completed':
                    with transaction.atomic():
                        if order: 
                            order.update(is_buyer_approved=True)
                            vendor = Users.objects.get(email=order.values('seller_email')[0]['seller_email'])
                            order = order.values('order_public_id','agreed_price','seller_email')[0]
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
                    response = {"status":False,"message":'Vendor must first mark this order as completed!'}
                    return Response(response)
            response = {"status":False,"message":'This order does not exist!'}
            return Response(response)
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
    
    
    def queue_vendor_payment_intent(self,order,vendor):
        try:
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
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)}) 
    
class CheckUserExists(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def post(self,request):
        try:
            if Users.objects.filter(email=request.data['email']).exists():
                response = {"status":True}
            else:
                response = {"status":False}
            return Response(response)
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})

class MakeUserVendorView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def post(self,request):
        try:
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
        except Exception as e:
            return Response({"status":False,"message":"Something went wrong!","error":str(e)})
    