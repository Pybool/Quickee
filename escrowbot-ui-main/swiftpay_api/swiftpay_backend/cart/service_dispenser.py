import jwt, ast
import  requests, json
from django.contrib.auth import get_user_model
from swiftpay_backend.services.mailservice import Mailservice
User = get_user_model()
from django.shortcuts import render
from .airtimeproc import AirtimeRechargeProcessor
from .dataproc import DataSubscriptionProcessor
from .cableproc import CableSubscriptionProcessor
from .electricityproc import ElectricityRechargeprocessor
from django.db import transaction
from swiftpay_backend.serializer import *
from swiftpay_backend.model import *
from swiftpay_backend.models.transaction_cart_model import *
from swiftpay_backend.services.airtimeservice import AirtimePurchaseService as AirtimeUtilityroutine
from swiftpay_backend.services.dataservice import DataSubscriptionService as DataUtilityroutine
from swiftpay_backend.services.cableservice  import CableSubscriptionService as CableUtilityroutine
from swiftpay_backend.services.electricityservice  import ElectricityPurchaseService as ElectricityUtilityroutine
from swiftpay_backend.history.transactionhistory_utils import TransactionHistoryUtils

class ServiceDispenser(object):
    
    def start(self,buyer_id,cart_reference,cart_items_length):
        print("\n\n\n\n\n\n\n\n\n\n\n\n=================>Service dispenser was called ")
        self.mail = VerifiedUsers() 
        self.mailservice = Mailservice(cart_items_length) 
        # print("Cart length here ",cart_items_length)   
        try:
            cart_tasks = self.gettasks(buyer_id) # Add cart reference to arguments
            iter_obj = iter(cart_tasks)
            self.airtimeutilityroutine = AirtimeUtilityroutine()
            self.datautilityroutine = DataUtilityroutine()
            self.cableutilityroutine = CableUtilityroutine()
            self.electricityutilityroutine = ElectricityUtilityroutine()
            self.buyer_id = buyer_id
            self.cart_reference = cart_reference
        except Exception as e:
            print("class error ",e)
        
        """ 
        This While block parses the cart data gotten from the database , dispensing each cart item as per its service type by calling functions from appropiate route
        and recording the status of each cart dispense
        """
        
        while True:
            try:
                task = next(iter_obj)
                # print("[Dispenser] ======> ", task, task['amount'])
                service = task['service']
                if service == 'Airtime purchase':
                    print("\n\n\n\nAirtime I was called ")
                    AirtimeRechargeProcessor(cart_reference,task,buyer_id,self.mailservice,self.airtimeutilityroutine,self.mail,self.vendResponseHandler)
                    # self.airtimerechargeprocessor(cart_reference,task,buyer_id,self.mailservice,self.utilityroutine,self.mail,self.vendResponseHandler)
                
                elif service == 'Data subscription':
                    print("\n\n\nData I was called ")
                    DataSubscriptionProcessor(cart_reference,task,buyer_id,self.mailservice,self.datautilityroutine,self.mail,self.vendResponseHandler)
                    
                elif service == 'Cable subscription':
                    CableSubscriptionProcessor(cart_reference,task,buyer_id,self.mailservice,self.cableutilityroutine,self.mail,self.vendResponseHandler)
                
                elif service == 'Electricity purchase':
                    ElectricityRechargeprocessor(cart_reference,task,buyer_id,self.mailservice,self.electricityutilityroutine,service,self.mail,self.vendResponseHandler)
                    # self.cableelectutilityroutine.electricityRoutine(electricity_purchase_data,cart_reference)
                
            except StopIteration:
                    break
        # return True
    """This function gets and returns all cart items for a particular buyer to the dispenser class constructor"""
    def gettasks(self,buyer_id):
        try:
            cart_tasks = TransactionCart.objects.filter(buyer_public_id=buyer_id).values()
            return cart_tasks
        except Exception as e:
            print("get task error ",e)

 
    def vendResponseHandler(self,response,service="null",operation='alpha'):
        
        if operation == "beta":
            self.buyer_id = response['uid']
        # print("Logging ",response)
        
        if response['code']=="success":
            """Set vending status in TransactionCart database """ 
            self.transactioncart = TransactionCart() # Initialize Transaction cart Instance
            if (service == "Electricity purchase"):
                
                data = {}
                data['token'] = response["data"]["token"]
                data['units_kw_h'] = response["data"]["units"]
                data['api_code'] = response["api_code"]
                data['amount_charged'] = response["data"]["amount_charged"]
                self.transactioncart.update_vend_status(response['order_id'])
                if operation == "alpha":
                    print("\n\nPerforming alpha type vending")
                    self.TransactionHistoryUtils = TransactionHistoryUtils(self.buyer_id,response['cart_reference'],response['order_id'],data)
                    return data
                
                elif operation == "beta":
                    print("\n\nPerforming beta type vending")
                    with transaction.atomic():
                        ElectricityPurchaseHistory.objects.filter(order_id=response['order_id']).update(vend_status=True)
                        TransactionCart.objects.filter(order_id =response['order_id']).delete()
                        print("donenaziba power")
                        return {"status":True, "message":"Order {0} has been resolved".format(response['order_id'])}
                                  
            else:
                
                self.transactioncart.update_vend_status(response['order_id'])  
                if operation == "alpha":
                     print("\n\nPerforming alpha type vending")
                     self.TransactionHistoryUtils = TransactionHistoryUtils(self.buyer_id,response['cart_reference'],response['order_id'])
                
                elif operation == "beta":
                   
                    with transaction.atomic():
                        if service == "airtime":
                            print("\n\nPerforming beta type vending for airtime")
                            AirtimePurchaseHistory.objects.filter(order_id=response['order_id']).update(vend_status=True)
                            TransactionCart.objects.filter(order_id =response['order_id']).delete()
                        elif service == "data":
                            print("\n\nPerforming beta type vending for data")
                            DataSubscriptionHistory.objects.filter(order_id=response['order_id']).update(vend_status=True)
                            TransactionCart.objects.filter(order_id =response['order_id']).delete()
                        elif service == "cable":
                            print("\n\nPerforming beta type vending for cable")
                            CableSubscriptionHistory.objects.filter(order_id=response['order_id']).update(vend_status=True)
                            TransactionCart.objects.filter(order_id =response['order_id']).delete()
                        
                        return {"status":True, "message":"Order {0} has been resolved".format(response['order_id'])}
        
        else:
            
            self.transactioncart = TransactionCart() # Initialize Transaction cart Instance
            if (service == "Electricity purchase"):
                data = {}
                data['token'] = response["data"]["token"]
                data['units_kw_h'] = response["data"]["units"]
                data['api_code'] = response["api_code"]
                data['amount_charged'] = response["data"]["amount_charged"]
                
                if operation == "alpha":
                     print("\n\nCannot perform alpha type vending")
                     self.TransactionHistoryUtils = TransactionHistoryUtils(self.buyer_id,response['cart_reference'],response['order_id'],data)
                     return response
                elif operation == "beta":
                    print("\n\nCannot perform beta type vending")
                    return response
                # return {"status":False, "message":"Vending for {0} failed".format(response['order_id'])}
            
            self.TransactionHistoryUtils = TransactionHistoryUtils(self.buyer_id,response['cart_reference'],response['order_id'])
            return response
    
