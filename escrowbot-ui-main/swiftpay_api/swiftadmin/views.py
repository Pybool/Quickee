from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from swiftpay_backend.models.api_providers_model import ApiProviders
from swiftpay_backend.models.cabletv_providers_model import CableTvProviders
from swiftpay_backend.models.network_providers_model import NetworkProviders
from swiftpay_backend.models.electricity_discos_model import ElectricityDiscos
from swiftpay_backend.models.cabletv_bouquet_model import CableTvBouquets
from swiftpay_backend.models.airtime_model import Airtime
from swiftpay_backend.models.datasubscription_model import DataSubscriptions

def get_network_providers():
    return NetworkProviders.objects.filter().values()

def get_cable_providers():
    return CableTvProviders.objects.filter().values()

def get_discos():
    return ElectricityDiscos.objects.filter().values()

class PricelistMetadata(APIView):
    def get(self, request):
        try:  
            api_providers = ApiProviders.objects.filter().values()
            network_providers = get_network_providers()
            discos = get_discos()
            cable_providers = get_cable_providers()
            return Response({"status": True, "api_providers": api_providers,'network_providers':network_providers,'discos':discos,'cable_providers':cable_providers})           
        except Exception as e:
            return Response({"status": False, "data": str(e)})

class Pricelist(APIView):
    def get(self, request,service,api_provider,service_provider):
        services = {"data":DataSubscriptions,'airtime':Airtime,'cable':CableTvBouquets,'electricity':ElectricityDiscos}
        try:  
            if service == 'data':
                pricelist = services[service].objects.filter(api_provider=api_provider,plan_provider=service_provider).values() 
            elif service == 'cable':
                pricelist = services[service].objects.filter(api_provider=api_provider,tv_bouquet_provider=service_provider).values()
            elif service == 'electricity':
                pricelist = services[service].objects.filter(api_provider=api_provider).values()
            return Response({"status": True, "data": pricelist,'service':service,'network_providers':get_network_providers()})           
        except Exception as e:
            return Response({"status": False, "data": str(e)})
    
    
        