from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt, uuid, json
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
from django.db import transaction
from swiftpay_backend.serializers import *
from swiftpay_backend.models import *
from django.utils.encoding import force_bytes, force_text
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from ..helpers.auth_helpers import AuthHelpers
confirmationtoken = None
from ..serializer import *
from swiftpay_backend.authentication.authenticate import ( JWTAuthenticationMiddleWare, create_access_token, 
                                 create_refresh_token, decode_access_token, decode_refresh_token
                                 )
# Create your views here.        

class ActivateAccount(APIView):
    
    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = {}
            user['uid'] = uid
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        decoded_payload = jwt.decode(token,'settings.SECRET_KEY', algorithms=['HS256'])
        if user is not None and (uid==decoded_payload['uid']):
            results = User.objects.get(public_id=uid)
            with transaction.atomic():
                results.isVerified = True
                results.save()    
            # user.is_active = True
            # user.save()
            results = VerifiedUsers.objects.filter(public_id=uid).values()
            return Response({"status": True, "message": 'Thank you for your email confirmation. Now you can login your account.'}, status=status.HTTP_200_OK)
        else:
            return Response({"status": False, "message": 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)
                
                   
class AuthSignup(APIView):
    def post(self, request):
        
        try:
            data =  json.loads(request.data['account_data'])
            public_id = str(uuid.uuid4())
            print("The data ", data,public_id)
            data['public_id'] = public_id
            data['password'] = make_password(data['password'], None, 'md5')
            serializer = VerifiedUsersSerializer(data=data)
            print(serializer)
            if serializer.is_valid():
                
                serializer.save()
                self.authhelpers = AuthHelpers()
                mail_parameters = {}
                user = serializer
                
                # uid_bytes = serializer.data['public_id'].encode('ascii')
                uid_bytes = public_id.encode('ascii') 
                mail_parameters['uid']= urlsafe_base64_encode(uid_bytes)
                mail_parameters['recipient']= serializer.data['email']
                mail_parameters['subject'] = 'Confirmation mail sent'
                user_ = {}
                user_['uid'] = public_id
                user_['exp'] = datetime.now() + timedelta(seconds=100000)
                # confirmationtoken = account_activation_token.make_token(user_)
                confirmationtoken = self.authhelpers._generate_jwt_token(user_, 'settings.SECRET_KEY')
                url = 'http:127.0.0.1:8000/api/v1/activate/{0}/{1}'.format(mail_parameters['uid'],confirmationtoken)
                print("Email confirmation token ", confirmationtoken)             
                mail_parameters['sender']= "swiftbillspaymentsng@gmail.com" #sendgrid password theblackhatsourcerer@2022
                mail_parameters['message']= "Your registration is almost complete"
                mail_parameters['html']= """<p>Click the link to confirm your account</p> <br><a href={0}>Click to Complete your Registration<a/>""".format(url)
                self.authhelpers.sendauthMail(mail_parameters)
                
                return Response({"status": True, "data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": False, "data": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AuthSignin(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            print(request.data)
            email = request.data['email']
            password = request.data['password']
            user = None
            try:
                # user = VerifiedUsers.objects.get(email=email).values(password)
                user = VerifiedUsers.objects.filter(email=email).values('password','public_id','username','isVerified','email','default_phonenumber','is_admin','is_root')

            except Exception as e:
                print('Cannot Authenticate user ',e)
                res = {'error': 'Non existent user '+ str(e)}
                return Response(res)
            
            if user:
                # try:
                    encrypted_password = user.first()['password']
                    if check_password(password, encrypted_password) and user.first()['isVerified']:
                        payload = user.first()
                        payload['exp'] = datetime.now() + timedelta(seconds=100000)
                        self.authhelpers = AuthHelpers()
                        print("========alt ", create_access_token(payload))
                        token = create_access_token(payload)  #self.authhelpers._generate_jwt_token(payload, 'settings.SECRET_KEY')
                        user_details = {}
                        user_details['status'] = True
                        user_details['public_id'] = "%s" % (user.first()['public_id'])
                        user_details['username'] = "%s" % (user.first()['username'])
                        user_details['mail'] = "%s" % (user.first()['email'])
                        user_details['phone'] = "%s" % (user.first()['default_phonenumber'])
                        user_details['token'] = token
                        user_details['is_admin'] = user.first()['is_admin']
                        user_details['is_root'] = user.first()['is_root']
                        return Response(user_details, status=status.HTTP_200_OK)
                    else:
                        res = {'status':False,
                            'error': 'Can not authenticate unverified user or Wrong password'}
                        # return Response(res, status=status.HTTP_403_FORBIDDEN)
                    
                # except Exception as e:
                #     print("Error ",e) 
            else:
                res = {'status':False,
                       'error': 'Can not authenticate with the given credentials or the account has been deactivated'}
                # return Response(res, status=status.HTTP_403_FORBIDDEN)
        except KeyError:
            res = {'error': 'please provide a email and a password'}
            return Response(res)