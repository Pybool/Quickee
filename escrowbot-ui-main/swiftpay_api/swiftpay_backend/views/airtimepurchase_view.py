from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from dotenv import load_dotenv
from ..services.airtimeservice import AirtimePurchaseService
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class AirtimeSubscription(APIView):
    def post(self, request):
        try:
            data=request.data
            data = data['data']
            if data:
                data['amount'] = str(int(data['amount']))
                self.airtimepurchaseservice = AirtimePurchaseService()
                response = self.airtimepurchaseservice.airtimeRecharge(data)
                
                if response['code']=='success' :
                    # Overide request data with response data
                    data['amount'] = response['data']['amount'] 
                    data['phonenumber'] = response['data']['phone']
                    data['ntwrk_provider'] = response['data']['network'].lower()
                    data['status'] = response['code']
                    self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'airtime')
                    return Response({"status": True,"message": response['message'], "data":  response['data']}, status=status.HTTP_200_OK)
                else:

                     data['status'] = response['code']
                     self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'airtime')
                     return Response({"status": False, "data": response['message']})
                
            else:
                return Response({"status": False, "data": "Enter valid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print({"status": False, "data": e})
            return Response({"status": False, "data": e})
        
    
