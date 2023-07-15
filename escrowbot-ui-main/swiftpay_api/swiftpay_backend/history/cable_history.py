from django.db import transaction
from swiftpay_backend.serializers import *
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from ..models.cable_subscription_history_model import *
from ..system.services_id import  getData

class CableHistoryUtils(object):
    
    def getAllCableSubscriptionHistory(self,uid,chunk_size,mode):
        
        history = []
        history_dict = {}
        try:
            for record in CableSubscriptionHistory.objects.all().filter(buyer_public_id=""+uid).values().order_by('-id').iterator(chunk_size=chunk_size):#2000 chunksise
      
                history_dict['cable_network'] = record['cable_provider']
                history_dict['recipient'] = record['iuc_number']
                history_dict['cable_plan'] = record['bouquet']
                history_dict['amount_charged'] = record['amount']
                history_dict['date_time'] = record['date_time']
                history_dict['vend_status'] = record['vend_status']
                history_dict['order_id'] = record['order_id']
                history_dict['cart_reference'] = record['cart_reference']
                history_dict['api_provider'] = record['api_provider']
                history_dict['mode'] = record['mode']
                history_dict['timestamp'] = record['timestamp']
                history_dict['service'] = "cable"
                history.append(history_dict)
                history_dict = {}
            
            print(history)
            if mode == "method":
                return history
            return {"status":True,"data":history, "message":"CableSubscription history was successfully fetched"}
        except Exception as e:
            return {"status":False, "message":"CableSubscription history could not be retrieved at this time"+str(e)}
        
        
    def filterCableHistoryByIUC(self,uid,search_by,params):
        
        results = CableSubscriptionHistory.objects.all().filter(phone_number=""+params,buyer_public_id=uid).values('network_provider','phone_number','plan')
        print("Cable subscription history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                self.plan = getData("vtung","data",results[history]['network_provider'].lower(),results[history]['plan'])
                print(100,self.plan,history)
                results[history]['amount'] = self.plan['amount']
                results[history]['bundle'] = self.plan['plan']
                history_struct.append(results[history])
            return {"status": True, "message":"Cable subscription history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}

    def filterCableHistoryByProvider(uid,search_by):
        results = CableSubscriptionHistory.objects.all().filter(network_provider=search_by,buyer_public_id=uid).values('network_provider','phone_number','plan','date_time')
        print("Cable subscription history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                history_struct.append(results[history])
            print("Cable subscription history  ", history_struct)
            return {"status": True, "message":"Data subscription history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}

    def filterCableHistoryByPeriod(self,uid,period,provider):
        
        from datetime import timedelta
        from django.utils import timezone
        time_threshold = timezone.now() - timedelta(days=period)
        print(time_threshold)
        # Entry.objects.filter(entered__gte=time_threshold)
        metrics = CableSubscriptionHistory.objects.all().filter(buyer_public_id=uid,date_time__gte=time_threshold).values('date_time','amount')
        print("The costs ", list(metrics))
        amount_metrics = sum(item['amount'] for item in list(metrics))
        return amount_metrics, metrics