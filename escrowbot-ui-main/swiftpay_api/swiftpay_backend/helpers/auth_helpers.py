import jwt
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from swiftpay_backend.serializers import *
from swiftpay_backend.models import *
from django.utils.encoding import force_bytes, force_text
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from ..helpers.tokens import account_activation_token

class AuthHelpers(object):
    
    def activate(request, uidb64, token):
        User = get_user_model()
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"status": True, "message": 'Thank you for your email confirmation. Now you can login your account.'}, status=status.HTTP_200_OK)
        else:
            return Response({"status": False, "message": 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)
        
    def decorator_auth(data):
        print("Decorator data ",data) 
        return data

    def _generate_jwt_token(self, payload, SECRET_KEY):
    
            """
            Generates a JSON Web Token that stores this user's ID and has an expiry
            date set to 60 days into the future.
            """
            

            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
            print("Generated token ", token)
            return token
        
    def sendauthMail(self, mail_parameters):
        
        try:
            mailparameters = mail_parameters
            html_content = mail_parameters['html']
            msg = EmailMultiAlternatives(mailparameters['subject'],mailparameters['message'],
                                         mailparameters['sender'], [mailparameters['recipient']])
            msg.attach_alternative(html_content, "text/html")
            msg.send() 
        except Exception as e:
            print("An error ocurred ",e)