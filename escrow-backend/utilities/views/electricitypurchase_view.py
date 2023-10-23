from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from dotenv import load_dotenv
from swiftpay_backend.models.electricity_discos_model import ElectricityDiscos
from ..services.electricityservice import ElectricityPurchaseService
from ..helpers.generic_helpers import getnumberfromstring
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")              
             
class ElectricitySubscription(APIView):
     
    def post(self, request):
        try:
            data=request.data
            data = data['data']
            uid = data['provider'].split(",")
           
            if data:
                self.electricitypurchaseservice = ElectricityPurchaseService()
                self.electricity_discos = ElectricityDiscos()
                api_code = uid[4]#self.electricity_discos.returnapi_code(uid[2])
                data['disco'] = api_code
                data['api_provider'] = uid[3]
                response = self.electricitypurchaseservice.electricityRoutine(data) 
                if response['code']=='success' :
                    # Overide request data with response data
                    data['amount_charged'] = str(float(getnumberfromstring(response['data']['amount_charged'])[0]))
                    data['phonenumber'] = response['data']['phone']
                    data['provider'] = response['data']['electricity']
                    data['recipient'] = data['recipient']
                    data['token'] = response['data']['token'].split(':')[1]
                    data['units'] = response['data']['units']
                    
                    data['status'] = response['code']
                    self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'electricity')
                    return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
                else:
                     
                     data['amount_charged'] = str(float(getnumberfromstring(response['data']['amount_charged'])[0]))
                     data['phonenumber'] = response['data']['phone']
                     data['provider'] = response['data']['electricity']
                     data['recipient'] = data['recipient']
                     data['token'] = response['data']['token'].split(':')[1]
                     data['units'] = response['data']['units']
                     data['status'] = response['code']
                     self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'electricity')
                     return Response({"status": False, "data": response['message']})    
            else:
                return Response({"status": False, "data": "Enter valid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": False, "data": e})
            
        
