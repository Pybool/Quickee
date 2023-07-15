from django.db import transaction
from swiftpay_backend.serializers import *
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from ..helpers.generic_helpers import cleanup,convertToNone
from ..models.airtime_purchase_history_model import *
from ..system.services_id import  getData

class AirtimeHistoryUtils(object):
    
    def getAllAirtimeHistory(self,uid,chunk_size,mode):
        
        history = []
        history_dict = {}
        for record in AirtimePurchaseHistory.objects.all().filter(buyer_public_id=""+uid).values().order_by('-id').iterator(chunk_size=chunk_size):#2000 chunksise
       
            history_dict['network'] = record['network_provider']
            history_dict['recipient'] = record['phone_number']
            history_dict['amount'] = record['amount']
            history_dict['date_time'] = record['date_time']
            history_dict['vend_status'] = record['vend_status']
            history_dict['order_id'] = record['order_id']
            history_dict['cart_reference'] = record['cart_reference']
            history_dict['api_provider'] = record['api_provider']
            history_dict['mode'] = record['mode']
            history_dict['timestamp'] = record['timestamp']
            history.append(history_dict)
            history_dict = {}
        
        # print(history)
        if mode == "method":
            return history
        return {"status":True,"data":history, "message":"Airtime history was successfully fetched"}  
        
    def filterAirtimeHistoryByPhone(self,uid,phone):
        # print(phone)
        results = AirtimePurchaseHistory.objects.all().filter(phone_number=""+phone, buyer_public_id=""+uid).values('network_provider','phone_number','amount').order_by('-id')
        # print("Airtime history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                self.getairtimediscount = getData("vtung","airtime",results[history]['network_provider'].lower())
                # print(100,self.getairtimediscount,history,self.getairtimediscount.split("%")[0])
                results[history]['discount'] = self.getairtimediscount
                results[history]['amount'] = float(results[history]['amount']) - (float(results[history]['amount']) * float((self.getairtimediscount.split("%")[0])))/100
                # history['discount'] = self.getairtimediscount
                history_struct.append(results[history])
                
            # print("Airtime history  ", history_struct)
            return {"status": True, "message":"Airtime history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}

    def filterAirtimeHistoryByNetwork(self,uid,network):
        results = AirtimePurchaseHistory.objects.all().filter(network_provider=""+network,buyer_public_id=uid).values('network_provider','phone_number','amount')
        print("Airtime history for user {0} ".format(uid), results)
        if results:
            history_struct = []
            for history in range(len(results)):
                self.getairtimediscount = getData("vtung","airtime",network.lower())
                # print(100,self.getairtimediscount,history,self.getairtimediscount.split("%")[0])
                results[history]['discount'] = self.getairtimediscount
                # print(type((self.getairtimediscount.split("%")[0])))
                results[history]['amount'] = float(results[history]['amount']) - (float(results[history]['amount']) * float((self.getairtimediscount.split("%")[0])))/100
                # history['discount'] = self.getairtimediscount
                history_struct.append(results[history])
  
            # print("Airtime history  ", history_struct)
            return {"status": True, "message":"Airtime history for user {0} successfully retrieved".format(uid), "data": history_struct}
        else:
            return {"status": False, "data":"Could not retrieve data plans"}
        
    
    def filterAirtimeHistoryByPeriod(self,uid,period,provider):
    
        time_threshold = timezone.now() - timedelta(days=period)
        print("\n\n\n\n\nTime ",time_threshold)
        provider = convertToNone(provider)
        if provider is None:
            metrics = AirtimePurchaseHistory.objects.all().filter(buyer_public_id=uid,date_time__gte=time_threshold).values('date_time','amount')
        else:
            metrics = AirtimePurchaseHistory.objects.all().filter(buyer_public_id=uid,network=provider,date_time__gte=time_threshold).values('amount')
        print(f"The Metrics for {provider} ", list(metrics))
        amount_metrics = sum(item['amount'] for item in list(metrics))
        print("Amount metrics ",amount_metrics)
        return amount_metrics, metrics