import asyncio, time
import random, celery, json
from celery import Celery
from swiftpay_api.celery import app
from asgiref.sync import sync_to_async
from swiftpay_backend.models.batch_proc_status_model import BatchProcStatus
from ..models.airtime_periodic_subscriptions_model import *
from ..models.cable_periodic_subscriptions_model import *
from ..models.data_periodic_subscriptions_model import *
from ..models.electricity_periodic_subscriptions_model import *
from swiftpay_backend.services.airtimeservice import *
from swiftpay_backend.services.dataservice import *
from swiftpay_backend.services.cableservice import *
from swiftpay_backend.services.electricityservice import *
BatchProcStatus.resetBatchProcStatus(None) #Reset Batchproc statuses

GENERIC_QUERY = "SELECT * FROM {} where ({}) >= (last_subscription + periodicity) and (periodicity={}) and (payment_status={});"

class BatchDispenser(object):
    def __init__(self, due_aggr_subscribers,periodicity):
        self.due_aggr_subscribers = due_aggr_subscribers
        self.services = []
        # print("====> ",self.due_aggr_subscribers, len(json.loads(self.due_aggr_subscribers['airtime'])['result']))
        airtimedispenselist = json.loads(self.due_aggr_subscribers['airtime'])['result']
        datadispenselist = json.loads(self.due_aggr_subscribers['data'])['result']
        cabledispenselist = json.loads(self.due_aggr_subscribers['airtime'])['result']
        electricitydispenselist = json.loads(self.due_aggr_subscribers['data'])['result']
        
        def Dispense_loop(service,dispenselist):
            
            if len(dispenselist) > 0:
                for dispenseitem in range(0,len(json.loads(self.due_aggr_subscribers[service])['result'])):
                    print(dispenselist[dispenseitem]['user_public_id'],\
                         dispenselist[dispenseitem]['subscription_recipient'],\
                         dispenselist[dispenseitem]['subscription_label'].split('@')[0]
                        )
                    dispenseDict =  dispenselist[dispenseitem]
                    service_payload = None
                    try:
                        service_payload = {
                                            'airtime':
                                                        {'uid':dispenseDict['user_public_id'],'phonenumber':dispenseDict['subscription_recipient'],
                                                        'ntwrk_provider':dispenseDict['service_provider'],'amount':dispenseDict['subscription_volume']},
                                            'data':
                                                        {'uid':dispenseDict['user_public_id'],'phonenumber':dispenseDict['subscription_recipient'],
                                                        'ntwrk_provider':dispenseDict['service_provider'],'variation_id':dispenseDict['subscription_volume'],
                                                        'api_provider':dispenseDict['api_provider'],'data_code':dispenseDict['service_code']},
                                            'cable':
                                                        {'uid':dispenseDict['user_public_id'],'phonenumber':dispenseDict['subscription_recipient'],
                                                        'ntwrk_provider':dispenseDict['service_provider'],'variation_id':dispenseDict['subscription_volume'],
                                                        'api_provider':dispenseDict['api_provider'],'cable_code':dispenseDict['service_code']},
                                            'electricity':
                                                        {'uid':dispenseDict['user_public_id'],'phonenumber':dispenseDict['subscription_recipient'],
                                                        'ntwrk_provider':dispenseDict['service_provider'],'variation_id':dispenseDict['subscription_volume'],
                                                        'api_provider':dispenseDict['api_provider'],'electricity_code':dispenseDict['service_code']}  
                                          }
                        data = service_payload[service]
                    except:
                        err_payload = {'uid':dispenseDict['user_public_id'],'phonenumber':dispenseDict['subscription_recipient'],
                                      'ntwrk_provider':dispenseDict['service_provider'],'amount':dispenseDict['subscription_volume']}
                        data = err_payload
                    print("********************************"+str(data))
                    response = self.dispenseServive(service,data) # Simulate service dispensal 
                    print('API response ',response)
                    if response['code']=='success': 
                        """Update last subscription in  order to determine next subscription date"""
                        airtime = lambda : AirtimePeriodicSubscriptions.update_last_subscription(dispenseDict['subscription_id'],time.time())
                        data = lambda : DataPeriodicSubscriptions.update_last_subscription(dispenseDict['subscription_id'],time.time())
                        cable = lambda : CablePeriodicSubscriptions.update_last_subscription(dispenseDict['subscription_id'],time.time())
                        electricity = lambda : ElectricityPeriodicSubscriptions.update_last_subscription(dispenseDict['subscription_id'],time.time())                    
                        resolvers = {
                                    "airtime": airtime , "data": data,
                                    "cable": cable ,"electricity":electricity
                                    }
                        
                        resolvers['{0}'.format(service)]()
                        print(f'Deleting {service} '+str(dispenselist[dispenseitem]['id']))
                        del dispenselist[dispenseitem] # delete each fulfilled subscription from the dispense list
                print(f"Terminanting {service} ======> ",dispenselist)
                self.services.remove(service) # Remove each procvessed service from self.services list 
                self.services.insert(0,None) # Replace each removed service with None to prevent corrupting the below for loop iterations
                print("=============>After removal: services "+ str(self.services))
                result = self.services.count(self.services[0]) == len(self.services) # Check if all services left in self.services are None
                if result: 
                    print("#########################################################################################")
                    BatchProcStatus.recordBatchProcStatus(periodicity,True) #Set Weekly status to true to enable continuation of weekly subscription
                return None
        
        if len(airtimedispenselist) > 0 or len(datadispenselist) > 0:
            BatchProcStatus.recordBatchProcStatus(periodicity,False) #Set Weekly status to false to disable continuation of weekly subscription
            if len(airtimedispenselist) > 0: self.services.append('airtime')
            if len(datadispenselist) > 0: self.services.append('data')
            if len(cabledispenselist) > 0: self.services.append('cable')
            if len(electricitydispenselist) > 0: self.services.append('electricity')
            print("=============> services "+ str(self.services))
                
            for service in range(0,len(self.services)):
                if self.services[service] ==  'airtime': dispenselist = airtimedispenselist
                if self.services[service] == 'data': dispenselist = datadispenselist
                if self.services[service] ==  'cable': dispenselist = cabledispenselist
                if self.services[service] == 'electricity': dispenselist = electricitydispenselist
                print("=====> I called Dispense_loop with these parameters "+str(self.services[service]))
                Dispense_loop(self.services[service],dispenselist)
                
    def dispenseServive(self,service,data):
        time.sleep(3)
        airtime_ = lambda :AirtimePurchaseService.airtimeRecharge(self,data)
        data_ = lambda : DataSubscriptionService.dataSubscription(self,data)
        cable_ = lambda : CableSubscriptionService.cableRoutine(self,data)
        electricity_ = lambda : ElectricityPurchaseService.electricityRoutine(self,data)                 
        resolvers = {
                    "airtime": airtime_ , "data": data_,
                    "cable": cable_ ,"electricity":electricity_
                    }
        return resolvers['{0}'.format(service)]()
     
def getDueAirtimeSubscriptions(periodicity):
    query = GENERIC_QUERY.format('swiftpay_backend_airtimeperiodicsubscriptions',time.time(),periodicity,True)
    results = AirtimePeriodicSubscriptions.objects.raw(query)
    return batchdataParser(results)

def getDueDataSubscriptions(periodicity):
    query = GENERIC_QUERY.format('swiftpay_backend_dataperiodicsubscriptions',time.time(),periodicity,True)
    results = DataPeriodicSubscriptions.objects.raw(query)
    return batchdataParser(results)

def getDueCableSubscriptions(periodicity):
    query = GENERIC_QUERY.format('swiftpay_backend_cableperiodicsubscriptions',time.time(),periodicity,True)
    results = CablePeriodicSubscriptions.objects.raw(query)
    return batchdataParser(results)

def getDueElectricitySubscriptions(periodicity):
    query = GENERIC_QUERY.format('swiftpay_backend_electricityperiodicsubscriptions',time.time(),periodicity,True)
    results = ElectricityPeriodicSubscriptions.objects.raw(query)
    return batchdataParser(results)
    
def batchDataGather(periodicity): 
    airtime = getDueAirtimeSubscriptions(periodicity)
    data = getDueDataSubscriptions(periodicity)
    cable = getDueCableSubscriptions(periodicity)
    electricity = getDueElectricitySubscriptions(periodicity)
    print({"airtime":airtime,"data":data,"cable":cable,"electricity":electricity})
    return {"airtime":airtime,"data":data,"cable":cable,"electricity":electricity}

def batchdataParser(results):
    lists = []
    x_results = {}
    for result in results:
        result.__dict__.pop('_state')
        lists.append(result.__dict__)
    x_results['result'] = lists
    str_ = str(x_results)
    str_ = ''.join([ch for ch in str_ if ch != '<'])
    str_ = ''.join([ch for ch in str_ if ch != '>'])
    str_ = str_.replace("None","\"Null\"")
    str_ = str_.replace("True","\"True\"")
    return str_.replace("\'", "\"")