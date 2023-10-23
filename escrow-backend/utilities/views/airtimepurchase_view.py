import uuid
from ..models import PendingPayments
from ..payments.payment_probe import Utility
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from dotenv import load_dotenv
from ..services.airtimeservice import AirtimePurchaseService
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = os.getenv("OPS")
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class AirtimeSubscription(APIView):

    def process_data_vending(self,data):
        data['amount'] = str(int(data['amount']))
        self.airtimepurchaseservice = AirtimePurchaseService()
        response = self.airtimepurchaseservice.airtimeRecharge(data)

        if response['code']=='success' :
            data['amount'] = response['data']['amount']
            data['phonenumber'] = response['data']['phone']
            data['ntwrk_provider'] = response['data']['network'].lower()
            data['status'] = response['code']
            return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
        else:
            data['status'] = response['code']
            return Response({"status": False, "message": response['message']})
    
    def confirm_payment(self,data):
        self.utility = Utility()
        self.confirmation = self.utility.verifyWithPaystack(data['transaction']['reference'])
        print("self.confirmation ", self.confirmation)
        
        return self.confirmation
    
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
                    new_data['_type'] = 'airtime'
                    new_data['order_ref'] = 'OA-'+ str(uuid.uuid4())
                    new_data['phone'] = data['phone']
                    new_data['service_request'] = data
                    PendingPayments.objects.create(**new_data)
                    return Response({"status": False, "message": "Your payments is pending, please do not retry this transaction!", 'data':new_data['order_ref']}, status=status.HTTP_202_ACCEPTED)
                else:
                    self.process_data_vending(data)
        except Exception as e:
            return Response({"status": False, "data": str(e)})
