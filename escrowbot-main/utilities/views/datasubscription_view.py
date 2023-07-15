import uuid
from utilities.models import PendingPayments
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..payments.payment_probe import Utility
# from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils
from ..services.dataservice import DataSubscriptionService

class DataSubscription(APIView):
    
    def process_data_vending(self,data):
        self.datasubscriptionservice = DataSubscriptionService()
        response = self.datasubscriptionservice.dataSubscription(data)
        
        if response['code']=='success' :
            data['amount'] = response['data']['amount']
            data['phonenumber'] = response['data']['phone']
            data['ntwrk_provider'] = response['data']['network'].split(',')[0]
            data['plan'] = response['data']['data_plan']
            data['status'] = response['code']
            # self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'data')
            return Response({"status": True, "data": response['message']}, status=status.HTTP_200_OK)
        else:
                data['status'] = response['code']
            #  self.transactionhistoryutils = TransactionHistoryUtils(None,None,None,data,'data')
                return Response({"status": False, "data": response['message']})
    
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
                    new_data['_type'] = 'data'
                    new_data['order_ref'] = 'OD-'+ str(uuid.uuid4())
                    new_data['phone'] = data['phonenumber']
                    new_data['service_request'] = data
                    PendingPayments.objects.create(**new_data)
                    return Response({"status": False, "message": "Your payments is pending, please do not retry this transaction!", 'data':new_data['order_ref']}, status=status.HTTP_202_ACCEPTED)
                else:
                    return self.process_data_vending(data)
                
        except Exception as e:
            return Response({"status": False, "data": str(e)})
