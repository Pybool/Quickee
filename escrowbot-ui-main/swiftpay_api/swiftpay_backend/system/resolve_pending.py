import time
from datetime import datetime
from rest_framework.response import Response
from rest_framework import viewsets, status
from ..cart.service_dispenser import ServiceDispenser as servicedispenser 

from swiftpay_backend.services.airtimeservice import AirtimePurchaseService as AirtimeUtilityroutine
from swiftpay_backend.services.dataservice import DataSubscriptionService as DataUtilityroutine
from swiftpay_backend.services.cableservice  import CableSubscriptionService as CableUtilityroutine
from swiftpay_backend.services.electricityservice  import ElectricityPurchaseService as ElectricityUtilityroutine

from swiftpay_backend.models.airtime_purchase_history_model import AirtimePurchaseHistory
from swiftpay_backend.models.cable_subscription_history_model import CableSubscriptionHistory
from swiftpay_backend.models.data_subscription_history_model import DataSubscriptionHistory
from swiftpay_backend.models.electricity_purchase_history_model import ElectricityPurchaseHistory
from swiftpay_backend.models.transaction_cart_model import TransactionCart

class ResolvePendingMethods(object):
    
    def __init__(self,__type__,*args):
        self.__type__ = __type__
        self.recipient = args[0]
        self.service_code = args[1]
        self.amount = args[2]
        self.provider_code = args[3]
        self.phonenumber = args[4]
        self.api_provider = args[5]
        self.data = {
                     "airtime":{"phonenumber":self.recipient,"ntwrk_provider":self.provider_code,"amount":self.amount},
                     "data":{"phonenumber":self.recipient,"ntwrk_provider":self.provider_code,"data_code":self.service_code,"api_provider":self.api_provider},
                     "cable":{"cabletv":self.provider_code,"tvplan":self.service_code,"phonenumber":self.phonenumber,"iuc:no":self.recipient,"api_provider":self.api_provider},
                     "electricity":{"metertype":self.service_code,"meterID":self.recipient,"phonenumber":self.phonenumber,"amount":self.amount,"disco":self.provider_code,"api_provider":self.api_provider}
                     }
        
    @staticmethod
    def checkduration(*args):
        seconds_hr = 70
        duration = (time.time()) - (args[0])
        print("Time in seconds past ",duration)
        if duration >= seconds_hr:
            return True
        return False
    
    @staticmethod
    def fetchorderdetails(order_id, order_type, mode):
        
        if mode == "cart_mode":
                                
            try:
                if order_type == "airtime":
                    timestamp = AirtimePurchaseHistory.returntimestamp(order_id)
                    return TransactionCart.objects.filter(order_id=order_id).values("recipient","provider","servicename","amount","payment_status","vend_status","timestamp", "phone_number","api_provider"),timestamp, order_id
                elif order_type == "data":
                    timestamp = DataSubscriptionHistory.returntimestamp(order_id)
                    print(timestamp)
                    return TransactionCart.objects.filter(order_id=order_id).values("recipient","provider","servicename","amount","payment_status","vend_status","timestamp", "phone_number","api_provider"),timestamp, order_id
                elif order_type == "cable":
                    timestamp = CableSubscriptionHistory.returntimestamp(order_id)
                    return TransactionCart.objects.filter(order_id=order_id).values("recipient","provider","servicename","amount","payment_status","vend_status","timestamp", "phone_number","api_provider"),timestamp, order_id
                elif order_type == "electricity":
                    timestamp = ElectricityPurchaseHistory.returntimestamp(order_id)
                    return TransactionCart.objects.filter(order_id=order_id).values("recipient","provider","servicename","amount","payment_status","vend_status","timestamp", "phone_number","api_provider"),timestamp, order_id
            except Exception as e:
                return {"status":False, "message":"An error {0} occured while fetching resolve data".format(e)}

        elif mode == "direct_mode":
            if order_type == "airtime":
                return AirtimePurchaseHistory.objects.filter(order_id=order_id).values(), order_id
            elif order_type == "data":
                return DataSubscriptionHistory.objects.filter(order_id=order_id).values(), order_id
            elif order_type == "cable":
                return CableSubscriptionHistory.objects.filter(order_id=order_id).values(), order_id
            elif order_type == "electricity":
                return ElectricityPurchaseHistory.objects.filter(order_id=order_id).values(), order_id
    
    @staticmethod
    def verifyrefundrules(orderdetails,mode):
        try:
            if mode == "direct_mode":
                timestamp = orderdetails[0][0]['timestamp']
            elif mode == "cart_mode":
                timestamp = float(orderdetails[1])
            if ResolvePendingMethods.checkduration(timestamp):                
                if orderdetails[0][0]['payment_status']:                    
                    if not orderdetails[0][0]['vend_status']:
                        print("We have verified that indeed this order was not serviced")
                        return {"status": True, "message": "We have verified that indeed this order was not serviced"}
                    else:
                        return {"status": False, "message": "This order has already been serviced , will not resolve this order"}
                else:
                    return {"status": False, "message": "Your payment could not be verified, this could be the reason for your dispense error"}
            else:
                return {"status": False, "message": "You must wait one hour before you can resolve this order!!!"}
        except Exception as e:
            return {"status":False, "message":"An error {0} occured while verifying refund".format(e)}

    def performresolverequest(self):
        payload = self.data["{0}".format(self.__type__)]
       
        try:
            """Replace the above function definitions with lambda functions below"""
            airtime = lambda : AirtimeUtilityroutine.airtimeRecharge(self,payload)
            data = lambda : DataUtilityroutine.dataSubscription(self,payload)
            cable = lambda : CableUtilityroutine.cableRoutine(self,payload)
            electricity = lambda : ElectricityUtilityroutine.electricityRoutine(self,payload)
            
            """Service the client here """############################
            
            resolvers = {
                        "airtime": airtime , "data": data,
                        "cable": cable ,"electricity":electricity
                        }
            if self.__type__ =="electricity":
                return resolvers['{0}'.format(self.__type__)](), self.__type__.title()+" purchase"
            return resolvers['{0}'.format(self.__type__)](), self.__type__
        
            ##########################################################
        except Exception as e:
            return {"status":False, "message":"An error {0} occured while perform order resolve".format(e)}
        
    @classmethod
    def createresolverequest(cls,__type__,*args):
        return ResolvePendingMethods(__type__,args[0],args[1],args[2],args[3],args[4],args[5])
    
    
    def updatedatabase(self,response,service):
        print(response,service)
        return servicedispenser.vendResponseHandler(self,response,service,operation="beta")
      

class ResolvependingWorker(object):
    
    def __new__(self,data):
        
        orderdetails = ResolvePendingMethods.fetchorderdetails(data['order_id'], data['order_type'], data['mode']) #Fetch full details from dtabase with order id and order type
        if data['mode']=="cart_mode":
            if len(orderdetails[0]) < 1:
                return Response({"status":False, "message":"Order {0} was not found, it has already been resolved".format(orderdetails[2])})
        elif data['mode'] == "direct_mode":
            if len(orderdetails[0]) < 1:
                return Response({"status":False, "message":"Order {0} was not found, it does not exist"})
            else:
                pass
        
        Status = ResolvePendingMethods.verifyrefundrules(orderdetails, data['mode']) # Verify that user has passed all revending rules and that the data from frontend is authentic
        
        if Status['status']:
            Response({"status": True, "message": Status['message']}, status=status.HTTP_200_OK)
            orderdetailsIndexed = orderdetails[0][0]
            if data['order_type']=="airtime":  
                orderdetailsIndexed['servicename'] = "airtime"
                orderdetailsIndexed['recipient'] = orderdetailsIndexed['phone_number'] 
                try:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['network_provider']
                except Exception as e:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['provider']
            
            elif data['order_type']=="data":  
                orderdetailsIndexed['servicename'] = "data"
                orderdetailsIndexed['recipient'] = orderdetailsIndexed['phone_number']
                try:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['network_provider']
                except Exception as e:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['provider']
                    
            elif data['order_type']=="cable":  
                orderdetailsIndexed['servicename'] = "cable"
                try:
                    orderdetailsIndexed['recipient'] = orderdetailsIndexed['iuc_number']
                except Exception as e:
                    orderdetailsIndexed['recipient'] = orderdetailsIndexed['recipient']
                try:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['cable_provider']
                except Exception as e:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['provider']
                    
            elif data['order_type']=="electricity":  
                orderdetailsIndexed['servicename'] = "electricity"
                try:
                    orderdetailsIndexed['recipient'] = orderdetailsIndexed['meter_number']
                except Exception as e:
                    orderdetailsIndexed['recipient'] = orderdetailsIndexed['recipient']
                try:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['disco'].split("$")[1]
                except Exception as e:
                    orderdetailsIndexed['provider'] = orderdetailsIndexed['provider']
                
            """Create a resolver request with the fetched data from the database"""
            self.resolverequest = ResolvePendingMethods.createresolverequest(data['order_type'],orderdetailsIndexed['recipient'],orderdetailsIndexed['servicename'],\
                                                                            orderdetailsIndexed['amount'], orderdetailsIndexed['provider'], orderdetailsIndexed['phone_number']\
                                                                            ,orderdetailsIndexed['api_provider'])
            
            """Perform the resolver request here to the appropriate vending service handler route"""
            resolver_ret_val = self.resolverequest.performresolverequest()
            _resolver_ret_val = resolver_ret_val[0]
            _resolver_ret_val['uid'] = data['uid']
            _resolver_ret_val['order_id'] = data['order_id']
            
            """Update the history vend_status for the order and delete from TransactionCart"""
            resolve_status = ResolvePendingMethods.updatedatabase(self,_resolver_ret_val,resolver_ret_val[1])
            # return Response({"status": True, "message": "We have verified that indeed this order was not serviced"})
            
            return resolve_status
        
        else:
            return Status
        
    # except Exception as e:
    #     print({"status": False, "data": e})
    #     return Response({"status": False, "data": e})   
        