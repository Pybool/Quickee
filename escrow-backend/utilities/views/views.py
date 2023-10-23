
from django.contrib.auth import get_user_model
# from .admin_views import CableTvProvidersViewSet
User = get_user_model()
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt, uuid, json
from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from utilities.models import *

     
class GetNetworkProviderView(APIView):
    
    def get(self, request):
        try:
            results = NetworkProviders.objects.all().values('public_id','isp_name','api_provider')
            return Response({"status": True, "message":"Network providers successfully retrieved", "data": list(results)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": False, "data": str(e)})
    
    # @is_admin
    def post(self,request):
        data = request.data
        data['public_id'] = uuid.uuid4()
        network_provider = NetworkProviders.objects.create(**data)
        if network_provider:
            response = {"status":True,"message":f"Network provider ({network_provider.isp_name}) was created"}
            return Response(response,status = status.HTTP_201_CREATED)
        else:
            response = {"status":False,"message":f"Network provider ({network_provider.isp_name}) was not created"}
            return Response(response,status=status.HTTP_200_OK)
        
class GetDataSubscriptionView(APIView):
    def get(self, request, uid):
        try:
            results = DataSubscriptions.objects.all().filter(plan_provider_id=get_object_or_404(NetworkProviders,public_id=uid).id).values('plan_provider_id','plan_name','plan_code','plan_price','duration','api_provider')
            if results:
                data_struct = []
                for plan in range(len(results)):
                    data_struct.append(results[plan])
                return Response({"status": True, "message":"Data plan for {0} successfully retrieved".format(uid), "data": data_struct}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not retrieve data plans"})
                
        except Exception as e:
            return Response({"status": False, "data": str(e)})
            
class GetCableTvProvidersView(APIView):
    def get(self, request):
        try:
            results = CableTvProviders.objects.all().values('id','public_id','cabletv_name','api_provider')
            if results:
                return Response({"status": True, "message":"Cable Tv providers successfully retrieved", "data": results}, status=status.HTTP_200_OK)
            else:
                return Response({"status": True, "message":"No results were found!", "data": []}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": False, "data": str(e)})
    
    def post(self,request):
        data = request.data
        data['public_id'] = uuid.uuid4()
        cable_provider = CableTvProviders.objects.create(**data)
        if cable_provider:
            response = {"status":True,"message":f"Cable provider ({cable_provider.cabletv_name}) was created"}
            return Response(response,status = status.HTTP_201_CREATED)
        else:
            response = {"status":False,"message":f"Cable provider ({cable_provider.cabletv_name}) was not created"}
            return Response(response,status=status.HTTP_200_OK)
               
class GetCableTvBouquetsView(APIView):
    def get(self, request):
        try:
            id = request.GET.get('id')
            results = CableTvBouquets.objects.all().filter(bouquet_provider_id=int(id)).values('bouquet_provider_id','bouquet_name','bouquet_price','bouquet_code','api_provider')
            if results:
                return Response({"status": True, "message":"Tv bouquets successfully retrieved", "data": results}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not retrieve data plans"})
                
        except Exception as e:
            print(str(e))
            return Response({"status": False, "data": str(e)})

class GetElectricityDiscos(APIView):
    def get(self, request):
        try:
            results = ElectricityDiscos.objects.all().values('public_id','disco_name','disco_code','api_provider','api_code')
            disco_struct = []
            for disco in range(len(results)):
                disco_struct.append(results[disco])
            return Response({"status": True, "message":"Discos successfully retrieved", "data": disco_struct}, status=status.HTTP_200_OK)
  
        except Exception as e:
            return Response({"status": False, "data": e})
                     
