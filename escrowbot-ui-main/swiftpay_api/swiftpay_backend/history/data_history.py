from django.db import transaction
from swiftpay_backend.serializers import *
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from ..models.data_subscription_history_model import *
from ..system.services_id import  getData

class DataHistoryUtils(object):
    
    def getAllDataSubscriptionHistory(self,uid,chunk_size,mode):
        
        history = []
        history_dict = {}
        try:
            for record in DataSubscriptionHistory.objects.all().filter(buyer_public_id=""+uid).values().order_by('-id').iterator(chunk_size=chunk_size):#2000 chunksise
                # print(record['network_provider'],record['phone_number'])
                history_dict['network'] = record['network_provider']
                history_dict['recipient'] = record['phone_number']
                history_dict['plan'] = record['plan']
                history_dict['amount'] = record['amount']
                history_dict['date_time'] = record['date_time']
                history_dict['vend_status'] = record['vend_status']
                history_dict['order_id'] = record['order_id']
                history_dict['cart_reference'] = record['cart_reference']
                history_dict['api_provider'] = record['api_provider']
                history_dict['service'] = "data"
                history_dict['mode'] = record['mode']
                history_dict['timestamp'] = record['timestamp']
                history.append(history_dict)
                history_dict = {}
            
            # print(history)
            if mode == "method":
                return history
            return {"status":True,"data":history, "message":"DataSubscription history was successfully fetched"}  
        except Exception as e:
            return {"status":False, "message":"DataSubscription history could not be retrieved at this time"}
        
        
    def filterDataHistoryByPhone(self,uid,search_by,params):
        
        results = DataSubscriptionHistory.objects.all().filter(phone_number=""+params,buyer_public_id=uid).values('network_provider','phone_number','plan')
        print("Data subscription history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                self.plan = getData("vtung","data",results[history]['network_provider'].lower(),results[history]['plan'])
                print(100,self.plan,history)
                results[history]['amount'] = self.plan['amount']
                results[history]['bundle'] = self.plan['plan']
                history_struct.append(results[history])
            return {"status": True, "message":"Data subscription history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}

    def filterDataHistoryByNetwork(uid,search_by):
        results = DataSubscriptionHistory.objects.all().filter(network_provider=search_by,buyer_public_id=uid).values('network_provider','phone_number','plan','date_time')
        print("Data subscription history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                history_struct.append(results[history])
            # print("Data subscription history  ", history_struct)
            return {"status": True, "message":"Data subscription history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}

    def filterDataHistoryByPeriod(self,uid,period,provider):
        
        from datetime import timedelta
        from django.utils import timezone
        time_threshold = timezone.now() - timedelta(days=period)
        print(time_threshold)
        # Entry.objects.filter(entered__gte=time_threshold)
        metrics = DataSubscriptionHistory.objects.all().filter(buyer_public_id=uid,date_time__gte=time_threshold).values('date_time','amount','plan')
        print("The costs ", list(metrics))
        amount_metrics = sum(item['amount'] for item in list(metrics))
        return amount_metrics, metrics