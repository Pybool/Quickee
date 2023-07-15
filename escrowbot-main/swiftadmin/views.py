from django.shortcuts import get_object_or_404
from utilities.models import CableTvProviders
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
# from swiftpay_backend.models.api_providers_model import ApiProviders
# from swiftpay_backend.models.cabletv_providers_model import CableTvProviders
from utilities.models import NetworkProviders, CableTvBouquets
# from swiftpay_backend.models.electricity_discos_model import ElectricityDiscos
from utilities.models import Airtime
from utilities.models import DataSubscriptions

# def get_network_providers():
#     return NetworkProviders.objects.filter().values()

# def get_cable_providers():
#     return CableTvProviders.objects.filter().values()

# def get_discos():
#     return ElectricityDiscos.objects.filter().values()

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
    
class DataPlansView(APIView):
    def post(self, request):
        data = request.data
        try:  
            data['plan_provider'] = NetworkProviders.objects.get(public_id=data['plan_provider_uid'])
            data.pop('plan_provider_uid')
            data_plan = DataSubscriptions.objects.create(**data)
            return Response({"status": True, 'message': f"Data plan ({data_plan.plan_name}) was created!"})           
        except Exception as e:
            return Response({"status": False, "error": str(e),"message":f"Data plan ({data['plan_name']}) was not created!"})
    
    
    def put(self, request, uid):
        try:
            data_subscription = DataSubscriptions.objects.filter(plan_provider_id=get_object_or_404(NetworkProviders,public_id=uid).id)
            update_status = data_subscription.update(**request.data)
            if update_status > 0:
                return Response({"status": True, "message":"Data plan was successfully updated"}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not update data plans"})
                
        except Exception as e:
            return Response({"status": False, "data": str(e)})
        
    def delete(self,request):
        
        try:
            data_subscription = DataSubscriptions.objects.filter(plan_provider_id=get_object_or_404(NetworkProviders,public_id=uid).id)
            update_status = data_subscription.delete()
            if update_status > 0:
                return Response({"status": True, "message":"Data plan was successfully deleted"}, status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data":"Could not delete data plan"})
                
        except Exception as e:
            return Response({"status": False, "data": str(e)})
        
class CableBouquetsView(APIView):
    
    def post(self,request):
        data = request.data
        try:  
            data['plan_provider'] = CableTvProviders.objects.get(public_id=data['provider_uid'])
            data.pop('provider_uid')
            bouquet = CableTvBouquets.objects.create(bouquet_provider=data['plan_provider'],
                                                    bouquet_name=data['bouquet_name'],
                                                    bouquet_code=data['plan_code'],
                                                    bouquet_price=data['plan_price'],
                                                    api_provider=data['api_provider']
                                                    )
            return Response({"status": True, 'message': f"Cable bouquet ({bouquet.bouquet_name}) was created!"})           
        except Exception as e:
            return Response({"status": False, "error": str(e),"message":f"Bouquet plan ({data['bouquet_name']}) was not created!"})
        
        