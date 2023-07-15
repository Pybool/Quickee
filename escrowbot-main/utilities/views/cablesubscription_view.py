from utilities.models import PendingPayments
from utilities.payments.payment_probe import Utility
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
# from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from dotenv import load_dotenv
from ..services.cableservice import CableSubscriptionService
from .helpers import getnumberfromstring
import os, uuid
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class CableTvSubscription(APIView):
    
    def process_data_vending(self,data):
        self.cablesubscriptionservice = CableSubscriptionService()
        response = self.cablesubscriptionservice.cableRoutine(data)
        
        if response['code']=='success' :
            # Overide request data with response data
            data['amount'] = str(float(getnumberfromstring(response['data']['amount_charged'])[0]))
            data['phonenumber'] = response['data']['phone']
            data['provider'] = data['provider'] #response['data']['cable_tv'] uncomment for live testing
            data['recipient'] = response['data']['smartcard_number']
            data['bouquet'] = data['servicename'] #
            
            data['status'] = response['code']
            # self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'cable')
            return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
        else:
                data['status'] = response['code']
            #  self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'data')
                return Response({"status": False, "message": response['message']})
    
    def confirm_payment(self,data):
        self.utility = Utility()
        return self.utility.verifyWithPaystack(data['transaction']['reference'])
     
    def post(self, request):
        try:
            data=request.data
            # data['paid'] = False
            # data['transaction']['reference'] = 'XXXXXXXXXXXXXXXXXXXX'
            if data.get('paid'):
                return self.process_data_vending(data)
            else:
                if not self.confirm_payment(data):
                    new_data = {}
                    new_data['_type'] = 'cable'
                    new_data['order_ref'] = 'OC-'+ str(uuid.uuid4())
                    new_data['phone'] = data['phonenumber']
                    new_data['service_request'] = data
                    PendingPayments.objects.create(**new_data)
                    return Response({"status": False, "message": "Your payments is pending, please do not retry this transaction!", 'data':new_data['order_ref']}, status=status.HTTP_202_ACCEPTED)
                else:
                    return self.process_data_vending(data)
                
        except Exception as e:
            return Response({"status": False, "data": str(e)})
              
             
