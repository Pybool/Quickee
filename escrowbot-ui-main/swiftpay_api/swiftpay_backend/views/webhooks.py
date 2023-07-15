
from django.contrib.auth import get_user_model
User = get_user_model()
from django.shortcuts import render
from rest_framework import viewsets, status
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
from ..helpers.auth_helpers import AuthHelpers
from ..serializer import *
     
# @decorator_auth(APIView)
class PaystackWebHooks(APIView):
    
    def post(self, request):
        
        try:
            print("\n\nWebhook request.......> ", request, request.json)
            print("\n\nWebhook request keys.......> ", request.keys())
            if request.json['event'] == 'charge.success':
                pass
                
            return Response({"status": True, "message":"Subscription payment was made"}, status=status.HTTP_200_OK)
  
        except Exception as e:
            return Response({"status": False, "data": e})
        
