import json
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from autosubscriptions.models.airtime_periodic_subscriptions_model import AirtimePeriodicSubscriptions
from autosubscriptions.model import Plans, Customers as PaystackCustomers
from swiftpay_backend.decorators import allowed_users
from swiftpay_backend.serializers import *
from swiftpay_backend.helpers.tokens import account_activation_token
from autosubscriptions.services.periodicsubscriptionservice import *
import time, requests

from django.db.models import Q
from swiftpay_backend.authentication.authenticate import JWTAuthenticationMiddleWare


TOKEN = "sk_test_4c18e79c7f6675bb9cfb9ffdc82faa65a024b12f" 
BASE_URL = "https://api.paystack.co/plan"
SUBS_BASE_URL = 'https://api.paystack.co/subscription'
CUST_BASE_URL = 'https://api.paystack.co/customer'


class Customers(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        try:
            if request.method == "GET":
                owner = request.user.email
                response = PaystackCustomers.objects.filter(Q(owner=owner) | Q(email=owner)).values()
                return Response({"status":True,"data":response})
        except Exception as e:
            return Response({"status": False, "data": e})
    
    def post(self,request):
        if request.method == "POST":
            data = request.data
            print(data)
            auth_response = requests.post(CUST_BASE_URL,json.dumps(data),headers={'Content-Type':'application/json','Authorization': f'Bearer {TOKEN}'})
            print(auth_response.json())
            data['owner'] = request.user.email
            response = auth_response.json()
            
            if response.get("status"):
                request.data['paystack_customer_id'] = response['data']['customer_code']
                PaystackCustomers.objects.create(**request.data)
                return Response(response)
            raise Exception("Customer creation failed at paystack")
        

class PlansView(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        try:
            service = request.query_params['service']
            if request.method == "GET":
                response = Plans.objects.filter(category=service.lower()).values()
                return Response({"status":True,"data":response})
        except Exception as e:
            return Response({"status": False, "data": e})
    
    @allowed_users()
    def post(self, request):
        try:
            
            data = {'name':request.data['name'],'interval':request.data['interval'],'amount':int(request.data['amount'])}
            auth_response = requests.post(BASE_URL,json.dumps(data),headers={'Content-Type':'application/json','Authorization': f'Bearer {TOKEN}'})
            print(auth_response.json())
            response = auth_response.json()
            
            if response.get("status"):
                request.data['plan_code'] = response.get("data")['plan_code']
                request.data['owner'] = request.user.email
                Plans.objects.create(**request.data)
                return Response(response)
            raise Exception("Plan creation failed at paystack")
        
        except Exception as e:
            return Response({"status": False, "data": e})
        
class PeriodicSubscribers(APIView):
    authentication_classes = [JWTAuthenticationMiddleWare]
    def get(self, request):
        try:
    
            service = request.query_params['service']
            if request.method == "GET":
                owner = request.user.email
                
                if service == 'airtime':
                    buffer = []
                    plans = Plans.objects.filter(owner=owner,category=service.title())
                    
                    for plan in plans:
                      response = AirtimePeriodicSubscriptions.objects.filter(plan_id = plan.id).values().first()
                      
                      if response is not None:
                        response['customer_extended'] = PaystackCustomers.objects.filter(id=response['customer_id']).values().first()
                        response['plan_extended'] = Plans.objects.filter(id=response['plan_id']).values().first()
                        buffer.append(response)
                        
                elif service == 'data':
                    buffer = []
                    plans = Plans.objects.filter(owner=owner,category=service.title())
                    
                    for plan in plans:
                      response = DataPeriodicSubscriptions.objects.filter(plan_id = plan.id).values().first()
                      
                      if response is not None:
                        response['customer_extended'] = PaystackCustomers.objects.filter(id=response['customer_id']).values().first()
                        response['plan_extended'] = Plans.objects.filter(id=response['plan_id']).values().first()
                        buffer.append(response)
                  
                elif service == 'cable':
                    buffer = []
                    plans = Plans.objects.filter(owner=owner,category=service.title())
                    
                    for plan in plans:
                      response = CablePeriodicSubscriptions.objects.filter(plan_id = plan.id).values().first()
                      
                      if response is not None:
                        response['customer_extended'] = PaystackCustomers.objects.filter(id=response['customer_id']).values().first()
                        response['plan_extended'] = Plans.objects.filter(id=response['plan_id']).values().first()
                        buffer.append(response)
                        
                return Response({"status":True,"data":buffer})
            
        except Exception as e:
            return Response({"status": False, "data": e})
        
    def post(self, request):
        try:
            selected_plan = request.data['plan']
            data = { "customer": request.data['customer'], "plan": selected_plan }
            auth_response = requests.post(SUBS_BASE_URL,json.dumps(data),headers={'Content-Type':'application/json','Authorization': f'Bearer {TOKEN}'})
            response = auth_response.json()
            
            if response.get("status"):
                saveresponse = ''
                service = request.data['subscriptions_service']
                
                if service == 'airtime':
                    saveresponse = AirtimeSubscriber.create(request.data)
                elif service == 'data':
                    saveresponse = DataSubscriber.create(request.data)
                elif service == 'cable':
                    saveresponse = CableSubscriber.create(request.data)
                elif service == 'power':
                    saveresponse = ElectricitySubscriber.create(request.data)
                print(saveresponse)
                if saveresponse[0]:
                    return Response({ "status": saveresponse[0],  "message": f"Created New {service.title()} Periodic subscription record","data":saveresponse })
                else:
                    return Response({"status": saveresponse[0], "message": 'Could not create new subscriber'})
            message = str(response['message']) + '. This customer must have performed atleast a single purchase to become a subscriber' if 'authorizations' in str(response['message']) else str(response['message'])
            return Response({"status":False,"message":message})
        
        except Exception as e:
            return Response({"status": False, "message": str(e)})
        