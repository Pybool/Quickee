from django.db import transaction
from swiftpay_backend.serializers import *
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from ..models.electricity_purchase_history_model import *
from ..system.services_id import  getData

class ElectricityHistoryUtils(object):
    
    def getAllElectricityPurchaseHistory(self,uid,chunk_size,mode):
        
        history = []
        history_dict = {}
        try:
            for record in ElectricityPurchaseHistory.objects.all().filter(buyer_public_id=""+uid).values().order_by('-id').iterator(chunk_size=chunk_size):#2000 chunksise
                # print(record['network_provider'],record['phone_number'])
                
                history_dict['disco'] = record['disco']
                history_dict['recipient'] = record['meter_number']
                history_dict['token'] = record['token']
                history_dict['amount'] = record['amount']
                history_dict['units'] = record['units']
                history_dict['amount_charged'] = record['amount_charged']
                history_dict['date_time'] = record['date_time']
                history_dict['vend_status'] = record['vend_status']
                history_dict['order_id'] = record['order_id']
                history_dict['cart_reference'] = record['cart_reference']
                history_dict['api_provider'] = record['api_provider']
                history_dict['mode'] = record['mode']
                history_dict['timestamp'] = record['timestamp']
                history_dict['service'] = "electricity"
                history.append(history_dict)
                history_dict = {}
            
            print(history)
            if mode == "method":
                return history
            return {"status":True,"data":history, "message":"Electricity purchase history was successfully fetched"}  
        except Exception as e:
            return {"status":False, "message":"Electricity purchase history could not be retrieved at this time"}
        
    def filterElectricityHistoryByPeriod(self,uid,period,provider):
        
        time_threshold = timezone.now() - timedelta(days=period)
        metrics = ElectricityPurchaseHistory.objects.all().filter(buyer_public_id=uid,date_time__gte=time_threshold).values('date_time','amount','units')
        amount_metrics = sum(item['amount'] for item in list(metrics))
        return amount_metrics, metrics