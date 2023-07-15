from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from dotenv import load_dotenv
from ..services.cableservice import CableSubscriptionService
from ..helpers.generic_helpers import getnumberfromstring
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class CableTvSubscription(APIView):
     
    def post(self, request):
        try:
            data=request.data
            data = data['data']
            if data:
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
                    self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'cable')
                    return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
                else:
                     data['amount'] = str(float(getnumberfromstring(response['data']['amount_charged'])[0]))
                     data['phonenumber'] = response['data']['phone']
                     data['provider'] = data['provider'] #response['data']['cable_tv'] uncomment for live testing
                     data['recipient'] = response['data']['smartcard_number']
                     data['bouquet'] = data['servicename'] #
                     data['status'] = response['code']
                     self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'cable')
                     return Response({"status": False, "data": response['message']})
            else:
                return Response({"status": False, "data": "Enter valid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": False, "data": e})
              
             
