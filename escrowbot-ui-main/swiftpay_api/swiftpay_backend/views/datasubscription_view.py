from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from dotenv import load_dotenv
from ..services.dataservice import DataSubscriptionService
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class DataSubscription(APIView):
    
    def post(self, request):
        try:
            data=request.data
            data = data['data']
            if data:
                self.datasubscriptionservice = DataSubscriptionService()
                response = self.datasubscriptionservice.dataSubscription(data)
                
                if response['code']=='success' :
                    data['amount'] = response['data']['amount']
                    data['phonenumber'] = response['data']['phone']
                    data['ntwrk_provider'] = response['data']['network'].split(',')[0]
                    data['plan'] = response['data']['data_plan']
                    data['status'] = response['code']
                    self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'data')
                    return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
                else:
                     data['status'] = response['code']
                     self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'data')
                     return Response({"status": False, "data": response['message']})
            else:
                return Response({"status": False, "data": "Enter valid subscription data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": False, "data": e})
