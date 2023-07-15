import  requests, json
from rest_framework.response import Response
from django.db import transaction
from swiftpay_backend.serializers import *
from swiftpay_backend.models import *
from datetime import timedelta
from django.utils import timezone
import requests, json
import re
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from swiftpay_backend.serializers import *
from ..models.airtime_purchase_history_model import *
from ..models.cable_subscription_history_model import *
from ..models.cabletv_bouquet_model import *
from ..models.cabletv_providers_model import *
from ..models.data_subscription_history_model import *
from ..models.datasubscription_model import *
from ..models.electricity_discos_model import *
from ..models.electricity_purchase_history_model import *
from ..models.network_providers_model import *
from ..models.transaction_cart_model import *
from ..models.user_model import *
from ..helpers.generic_helpers import returndatetime as getdatetime

    
class TransactionHistoryUtils(object):
    
    def __init__(self, buyer_id=None,cart_reference=None,order_id=None,data='null',service=''):
 
        if cart_reference and order_id is not None:
            
            carttodelete = TransactionCart.objects.filter(buyer_public_id = buyer_id, order_id = order_id, cart_reference = cart_reference).values()
            try:
                self.moveToHistoryDelete(carttodelete,order_id,data)
            except Exception as e:
                print(f'An error occured in transaction history initialization {str(e)}')
    
        else:
            self.moveToHistoryDelete(None,None,data,service)

    def getnumberfromstring(self,str):
        
        new_string = str
        new_result = re.findall(r"[-+]?\d*\.\d+|\d+", new_string)
        return new_result
    
    def moveToHistoryDelete(self,carttodelete=None,order_id=None,data=None,service=''):
        
        # try:
        if carttodelete and order_id is not None: # Calling move to history function without arguments means its a direct transaction
            carttodelete = carttodelete[0]
            
            if carttodelete['service'] == "Airtime purchase":
                with transaction.atomic():
                    
                    airtimepurchasehistory= AirtimePurchaseHistory( buyer_public_id= carttodelete['buyer_public_id'],
                                                                    order_id=order_id,network_provider=carttodelete['provider'],
                                                                    phone_number=carttodelete['recipient'],amount=carttodelete['amount'],
                                                                    vend_status= carttodelete['vend_status'],date_time=getdatetime(), mode = "cart_mode",
                                                                    cart_reference = carttodelete['cart_reference'],timestamp = carttodelete['timestamp']
                                                                    )
                    airtimepurchasehistory.save()
                try:
                    if carttodelete['vend_status']:
                        delete_status = TransactionCart.objects.filter(buyer_public_id = carttodelete['buyer_public_id'], order_id = order_id, cart_reference = carttodelete['cart_reference']).delete()
                        if delete_status[0] !=0:
                            print("Airtime recharge Cart item {0} was deleted after vending was completed".format(order_id))
                except Exception as e:
                    transaction.set_rollback(True)
        
                
            elif carttodelete['service'] == "Data subscription":
                with transaction.atomic():
                    plan_name = DataSubscriptions.objects.filter(plan_code = carttodelete['servicename']).values('plan_name')
                    plan_name = plan_name[0]['plan_name']
                    datasubscriptionhistory = DataSubscriptionHistory(  buyer_public_id= carttodelete['buyer_public_id'],
                                                                        order_id=order_id,network_provider=carttodelete['provider'],
                                                                        phone_number=carttodelete['recipient'],plan=plan_name, mode = "cart_mode",
                                                                        amount= carttodelete['amount'],vend_status= carttodelete['vend_status'],
                                                                        date_time=getdatetime(),cart_reference = carttodelete['cart_reference'],
                                                                        variation_id=carttodelete['servicename'],timestamp = carttodelete['timestamp']
                                                                        ,api_provider = carttodelete['api_provider'],payment_status= True)
                                                                        
                    datasubscriptionhistory.save()
                try:
                    if carttodelete['vend_status']:
                        delete_status = TransactionCart.objects.filter(buyer_public_id = carttodelete['buyer_public_id'], order_id = order_id, cart_reference = carttodelete['cart_reference']).delete()
                        if delete_status[0] !=0:
                            print("Data subscription Cart item {0} was deleted after vending was completed".format(order_id))
                except Exception as e:
                    transaction.set_rollback(True)
                        
            elif carttodelete['service'] == "Cable subscription":
                with transaction.atomic():
                    tv_bouquet_name = CableTvBouquets.objects.filter(tv_bouquet_variation_id = carttodelete['servicename']).values('tv_bouquet_name')
                    tv_bouquet_name = tv_bouquet_name[0]['tv_bouquet_name']
                    cablesubscriptionhistory = CableSubscriptionHistory(  buyer_public_id= carttodelete['buyer_public_id'],
                                                                        order_id=carttodelete['order_id'],cable_provider=carttodelete['provider'],
                                                                        iuc_number=carttodelete['recipient'],bouquet=tv_bouquet_name, mode = "cart_mode",
                                                                        amount= carttodelete['amount'],vend_status= carttodelete['vend_status'],
                                                                        date_time=getdatetime(),cart_reference = carttodelete['cart_reference']
                                                                        ,timestamp = carttodelete['timestamp'],api_provider = carttodelete['api_provider'],)
                    cablesubscriptionhistory.save()
                try:
                    if carttodelete['vend_status']:
                        delete_status = TransactionCart.objects.filter(buyer_public_id = carttodelete['buyer_public_id'], order_id = carttodelete['order_id'], cart_reference = carttodelete['cart_reference']).delete()
                        if delete_status[0] !=0:
                            print("Cable subscription Cart item {0} was deleted after vending was completed".format(order_id))
                        pass
                except Exception as e:
                    transaction.set_rollback(True)

            if carttodelete['service'] == "Electricity purchase":
                with transaction.atomic():
                    electricitypurchasehistory = ElectricityPurchaseHistory(buyer_public_id= carttodelete['buyer_public_id'],api_provider = carttodelete['api_provider'],
                                                                            order_id=carttodelete['order_id'],disco=carttodelete['provider'].split(",")[0],
                                                                            meter_number=carttodelete['recipient'],meter_type=carttodelete['servicename'].title(),
                                                                            amount= carttodelete['amount'],vend_status= carttodelete['vend_status'],
                                                                            date_time=getdatetime(),cart_reference = carttodelete['cart_reference'], mode = "cart_mode",
                                                                            token = data['token'],units = data['units_kw_h'],amount_charged = data['amount_charged']
                                                                            ,timestamp = carttodelete['timestamp']
                                                                            
                                                                        )
                    electricitypurchasehistory.save()
                try:
                    if carttodelete['vend_status']:
                        delete_status = TransactionCart.objects.filter(buyer_public_id = carttodelete['buyer_public_id'], order_id = carttodelete['order_id'], cart_reference = carttodelete['cart_reference']).delete()
                        if delete_status[0] !=0:
                            print(" Electricity Purchase Cart item {0} was deleted after vending was completed".format(order_id))
                        pass
                except Exception as e:
                    transaction.set_rollback(True)
        
        else:
            
            if service == 'airtime':
                status = None
                if data['status'] == "success":
                    status = True
                else:
                    status = False
                with transaction.atomic():
                    airtimepurchasehistory= AirtimePurchaseHistory(buyer_public_id= data['orderRef'],api_provider = data['ntwrk_provider'].split(',')[1],
                                                                    network_provider=data['ntwrk_provider'], order_id= data['order_id'],
                                                                    phone_number=data['phonenumber'],amount= float(self.getnumberfromstring(data['amount'])[0])/100,
                                                                    vend_status= status, date_time= getdatetime(),timestamp = time.time(), mode = "direct_mode",payment_status= True
                                                                    )
                    airtimepurchasehistory.save()
                    print("Airtime recharge was added to history after vending was completed")

            elif service == 'data':
                status = None
                if data['status'] == "success":
                    status = True
                else:
                    status = False
                with transaction.atomic():
                    self.datasubscriptions = DataSubscriptions()
                    plan = self.datasubscriptions.getplanname(data['data_code'])
                    datasubscriptionhistory= DataSubscriptionHistory(buyer_public_id= data['orderRef'],
                                                                    network_provider=data['ntwrk_provider'],plan = plan, order_id= data['order_id'],
                                                                    variation_id = data['data_code'],amount = float(self.getnumberfromstring(data['amount'])[0]),
                                                                    phone_number=data['phonenumber'],timestamp = time.time(),api_provider = data['api_provider'],
                                                                    vend_status= status, date_time= getdatetime(), mode = "direct_mode",payment_status= True
                                                                    )
                    datasubscriptionhistory.save() 
                    print("Data subscription was added to history after vending was completed, with a {0} vend value".format(status))

            elif service == 'cable':
                self.instancecablesubscription = CableTvBouquets()
                self.bouquet = self.instancecablesubscription.returnapi_tv_bouquetname(data['bouquet'])
                status = None
                if data['status'] == "success":
                    status = True
                else:
                    status = False
                with transaction.atomic():
                    cablesubscriptionhistory= CableSubscriptionHistory(buyer_public_id= data['orderRef'],order_id= data['order_id'],
                                                                    cable_provider=data['provider'],bouquet = self.bouquet,phone_number=data['phonenumber'],
                                                                    amount = float(self.getnumberfromstring(data['amount'])[0]),api_provider = data['api_provider'],
                                                                    vend_status= status, date_time= getdatetime(),iuc_number=data['recipient']
                                                                    ,timestamp = time.time(), mode = "direct_mode",payment_status= True
                                                                    )
                    cablesubscriptionhistory.save()
                    print("Cable subscription was added to history after vending was completed")
    
            elif service == 'electricity':
                
                status = None
                if data['status'] == "success":
                    status = True
                else:
                    status = False
                with transaction.atomic():
                    electricitypurchasehistory= ElectricityPurchaseHistory(buyer_public_id= data['orderRef'],order_id= data['order_id'],api_provider = data['api_provider'],
                                                                            disco=data['provider']+'$'+data['disco'],meter_number = data['recipient'],meter_type= data['meter_type'],
                                                                            amount = data['amount'],amount_charged = data['amount_charged'], token = data['token'],
                                                                            units = data['units'],vend_status= status, date_time= getdatetime(),timestamp = time.time(),
                                                                            mode = "direct_mode",payment_status= True,phone_number=data['phonenumber']\
                                                                            )
                    electricitypurchasehistory.save()
                    print("Electricty purchase was added to history after vending was completed")
        # except Exception as e:
        #     print("Transaction migartrion error  ", e)