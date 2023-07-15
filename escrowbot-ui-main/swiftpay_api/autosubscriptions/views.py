from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from autosubscriptions.models.airtime_periodic_subscriptions_model import AirtimePeriodicSubscriptions
from swiftpay_backend.serializers import *
from swiftpay_backend.helpers.tokens import account_activation_token
from autosubscriptions.services.periodicsubscriptionservice import *
import time

SUBS_base_url = "https://api.paystack.co/subscription"

class GetPeriodicSubscriber(APIView):
    def get(self, request):
        try:
            print("=========================> ",type(request), dir(request), request.data)
            response = self.utility.verifyWithPaystack(request.data['reference'])
            if response['status']:
                pass
            else:
                return Response({ "status": False,  "message": "Merchant did not receive funds" })
        except Exception as e:
            return Response({"status": False, "data": e})
        
# class CreatePeriodicSubscriber(APIView):
    
#     def post(self, request):
        


class EditPeriodicSubscriber(APIView):
    
    def post(self, request):
        try:
            print("Updating Periodic Subscription data =========================> ", request.data)
            saveresponse = ''
            if request.data['data']['subscriptionsservice'] == 'airtime':
                saveresponse = AirtimeSubscriber.update(request.data)
            if request.data['data']['subscriptionsservice'] == 'data':
                saveresponse = DataSubscriber.update(request.data)
            if request.data['data']['subscriptionsservice'] == 'cable':
                saveresponse = CableSubscriber.update(request.data)
            if request.data['data']['subscriptionsservice'] == 'power':
                saveresponse = ElectricitySubscriber.update(request.data)
            if saveresponse[0]:
                return Response({ "status": saveresponse[0],  "message": f"Updated {request.data['data']['subscriptionsservice'].title()} Periodic subscription record","data":saveresponse })
            else:
                return Response({"status": saveresponse[0], "message": 'Could not update this subscription'})
        except Exception as e:
            return Response({"status": False, "data": e})


class DeletePeriodicSubscriber(APIView):
    def delete(self, request):
        try:
            print("Deleting Periodic Subscription data =========================> ", request.data)
            saveresponse = ''
            if request.data['data'] == 'airtime':
                saveresponse = AirtimeSubscriber.delete(request.data)
            if request.data['data'] == 'data':
                saveresponse = DataSubscriber.delete(request.data)
            if request.data['data'] == 'cable':
                saveresponse = CableSubscriber.delete(request.data)
            if request.data['data'] == 'power':
                saveresponse = ElectricitySubscriber.delete(request.data)
            if saveresponse:
                return Response({ "status": saveresponse,  "message": f"Deleted {request.data['subscription']} Periodic subscription record added" })
            else:
                return Response({"status": saveresponse, "message": 'Could not delete this subscription'})
        except Exception as e:
            return Response({"status": False, "data": e})
           