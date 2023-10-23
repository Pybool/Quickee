
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
class GetNetworkProvider(APIView):
    
    def get(self, request):
        
        try:
            self.authhelpers = AuthHelpers()
            results = NetworkProviders.objects.all().values('public_id','isp_name','api_provider')
            print("Network providers ", results)
            isp_struct = []
            for isp in range(len(results)):
                isp_struct.append(results[isp])
            print("Network providers ", isp_struct)
            return Response({"status": True, "message":"Network providers successfully retrieved", "data": isp_struct}, status=status.HTTP_200_OK)
  
        except Exception as e:
            return Response({"status": False, "data": e})
        
   
class GetDataSubscription(APIView):
    def get(self, request, uid):
        try:
            self.authhelpers = AuthHelpers()
            results = DataSubscriptions.objects.all().filter(plan_provider_id=uid).values('plan_provider_id','plan_name','plan_code','plan_price','duration','api_provider')
            if results:
                data_struct = []
                for plan in range(len(results)):
                    data_struct.append(results[plan])
                return Response({"status": True, "message":"Data plan for {0} successfully retrieved".format(uid), "data": data_struct}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not retrieve data plans"})
                
        except Exception as e:
            return Response({"status": False, "data": e})
            
class GetCableTvProviders(APIView):
    def get(self, request):
        try:
            self.authhelpers = AuthHelpers()
            results = CableTvProviders.objects.all().values('public_id','cabletv_name','api_provider')
            cable_struct = []
            for cable in range(len(results)):
                cable_struct.append(results[cable])
            return Response({"status": True, "message":"Cable Tv providers successfully retrieved", "data": cable_struct}, status=status.HTTP_200_OK)
  
        except Exception as e:
            return Response({"status": False, "data": e})
               
class GetCableTvBouquets(APIView):
    def get(self, request, uid):
        try:
            self.authhelpers = AuthHelpers()
            results = CableTvBouquets.objects.all().filter(tv_bouquet_provider_id=uid).values('tv_bouquet_provider_id','tv_bouquet_name','tv_bouquet_price','tv_bouquet_variation_id','api_provider')
            if results:
                data_struct = []
                for plan in range(len(results)):
                    data_struct.append(results[plan])
                return Response({"status": True, "message":"Tv bouquets {0} successfully retrieved".format(uid), "data": data_struct}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not retrieve data plans"})
                
        except Exception as e:
            return Response({"status": False, "data": e})

class GetElectricityDiscos(APIView):
    def get(self, request):
        try:
            self.authhelpers = AuthHelpers()
            results = ElectricityDiscos.objects.all().values('public_id','disco_name','disco_code','api_provider','api_code')
            disco_struct = []
            for disco in range(len(results)):
                disco_struct.append(results[disco])
            return Response({"status": True, "message":"Discos successfully retrieved", "data": disco_struct}, status=status.HTTP_200_OK)
  
        except Exception as e:
            return Response({"status": False, "data": e})
                     
