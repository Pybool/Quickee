import os, ast, random
import requests
from functools import wraps
from dotenv import load_dotenv
load_dotenv()
productionmode = str(os.getenv("PRODUCTION_MODE"))

class VtungRequestParser(object):

    def __init__(self,ops,username,api_password, *args, **kwargs): #Ops is a test variable to be removed 
        
        self.ops = ops
        self.kwargs = kwargs
        self.username = username
        self.api_password = api_password
        self.args = args
        self.__servicetype__ = args[1]
        
        print("ARGS======> ", self.args)

    def airtimeParser(self): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        print("Vending airtime.....")
        airtime_endpoint = "https://vtu.ng/wp-json/api/v1/airtime"
        ploads = {'username':self.username,'password':self.api_password,'phone':self.args[0]['phone'],'network_id':self.args[0]['ntwrk_provider'],'amount':int(self.args[0]['amount'])}
        if productionmode == 'True':
            response = requests.get(airtime_endpoint,params=ploads)
            response = ast.literal_eval(response.text)
            response['message'] = "Airtime recharge successful"
            return response
        
        # """Mock response for development ###########################"""
        elif productionmode == 'False':
            import random
            response_success = {"code":"success","message":"Airtime successfully delivered","data":{"network":self.args[0]['ntwrk_provider'],"phone":self.args[0]['phone'],"amount":str(self.args[0]['amount'])}}            
            response_failure = {"code":"failure","message":"Airtime recharge failed","data":{"network":self.args[0]['ntwrk_provider'],"phone":self.args[0]['phone'],"amount":self.args[0]['amount']}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(self.ops,self.ops)]
            response['message'] = "Airtime recharge successful"
            return response
      
    def dataParser(self): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
    
        data_endpoint = "https://vtu.ng/wp-json/api/v1/data"
        ploads = {'username':self.username,'password':self.api_password,'phone':self.args[0]['phonenumber'],'network_id':self.args[0]['ntwrk_provider'].split(",")[0].lower(),'variation_id':self.args[0]['data_code']}
        if productionmode == 'True':
            response = requests.get(data_endpoint,params=ploads)
            response = ast.literal_eval(response.text)
            response['message'] = "Data subscription successful"
            return response
        
        elif productionmode == 'False':
            """Mock response for development"""
            
            response_success = {"code":"success","message":"Data successfully delivered","data":{"network":self.args[0]['ntwrk_provider'].upper(),"data_plan":self.args[0]['data_code'],"phone":self.args[0]['phonenumber'],"amount":"NGN259","order_id":"2443"}}            
            response_failure = {"code":"failure","message":"Data subscription failed","data":{"network":self.args[0]['ntwrk_provider'].upper(),"data_plan":self.args[0]['data_code'],"phone":self.args[0]['phonenumber'],"amount":"NGN259","order_id":"2443"}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(self.ops,self.ops)]
            response['message'] = "Data subscription successful"
            return response

    def cableParser(self): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        try:
            cable = self.args[0]['cabletv']
            plan_id = self.args[0]['tvplan']
            phonenumber = self.args[0]['phonenumber']
            IUC_number = self.args[0]['iuc:no']
        except Exception as e:
            cable = self.args[0]['provider'].split(",")[0].lower()
            plan_id = self.args[0]['servicename']
            phonenumber = self.args[0]['phonenumber']
            IUC_number = self.args[0]['recipient']
        
        ploads = {'username':self.username,'password':self.api_password,'phone':phonenumber,'service_id':cable,'smartcard_number':IUC_number,'variation_id':plan_id}
        if productionmode == 'True':
            r = requests.get('https://vtu.ng/wp-json/api/v1/tv',params=ploads)
            r = ast.literal_eval(r.text)#'''convert response unicode dict to python dict'''
            if r['code']=='success' :
                message = "{} Your {} decoder {} has been subscribed with {}...Phone number: {}  Amount charged: {} Order id: {}".format(r['message'],r['data']['cable_tv'],r['data']['smartcard_number'],r['data']['subscription_plan'],r['data']['phone'],r['data']['amount_charged'],r['data']['order_id'])
                return {"status":True,"message":message}
            elif r['code']=='failure':
                return {"status":False,"message":r['message']}

        elif productionmode == 'False':
            """Mock response for development"""
            response = {"code":"success","message":"Cable TV subscription successfully delivered","data":{"cable_tv":"gotv","subscription_plan":"gotv smallie","smartcard_number":"37829299","phone":"08184394849","amount":"NGN3280","amount_charged":"NGN"+"4000","service_fee":"NGN0.00","order_id":"2876"}}
            response_success = {"code":"success","message":"Cable TV subscription successfully delivered","data":{"cable_tv":"gotv","subscription_plan":"gotv smallie","smartcard_number":"37829299","phone":"08184394849","amount":"NGN3280","amount_charged":"NGN"+"4000","service_fee":"NGN0.00","order_id":"2876"}}           
            response_failure = {"code":"failure","message":"Cable TV subscription Failed","data":{"cable_tv":"gotv","subscription_plan":"gotv smallie","smartcard_number":"37829299","phone":"08184394849","amount":"NGN3280","amount_charged":"NGN"+"4000","service_fee":"NGN0.00","order_id":"2876"}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(self.ops,self.ops)]
            response['message'] = "Cable subscription successful"
            return response
    
    def electricityParser(self,ops,username,api_password,args,kwargs): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        
        try:
            meter_type = args[0]['metertype']
            meter_no =   args[0]['meterID']
            phone_no =   args[0]['phonenumber']
            amount =     args[0]['amount']
            service_id=  args[0]['disco']
            
        except Exception as e:
            meter_type = args[0]['meter_type']
            meter_no =   args[0]['recipient']
            phone_no =   args[0]['phonenumber']
            amount =     args[0]['amount']
            service_id=  args[0]['disco']
            
        
        ploads = {'username':username,'password':api_password,'phone':phone_no,'meter_number':meter_no,'service_id':service_id,'variation_id':meter_type,'amount':amount}
        if productionmode == 'True':
            r = requests.get('https://vtu.ng/wp-json/api/v1/electricity',params=ploads)
            r = ast.literal_eval(r.text)#'''convert response unicode dict to python dict'''
            if r['code']=='success' :
                message = "Electricity purchase successful..\n\nYour {} meter {} has been topped up with {}...\nHere is your recharge {} \nOrder id: {}".format(r['data']['electricity'],r['data']['meter_number'],r['data']['amount'],r['data']['token'],r['data']['order_id'])
                return {"status":True,"message":message}
            elif r['code']=='failure':
                return {"status":False,"message":r['message']}
        
        elif productionmode == 'False':
            """Mock response for development"""
            response_success = {"code":"success","message":"Electricity bill successfully paid","data":{"electricity":"Ikeja (IKEDC)","meter_number":"62418234034","token":"Token: 5345 8765 3456 3456 1232","units":"47.79kwH","phone":args[0]['phonenumber'],"amount_charged":"NGN2970"}}           
            response_failure = {"code":"failure","message":"Electricity bill payment failed","data":{"electricity":"Ikeja (IKEDC)","meter_number":"62418234034","token":"Token: 5345 8765 3456 3456 1232","units":"47.79kwH","phone":args[0]['phonenumber'],"amount_charged":"NGN2970"}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(ops,ops)]
            
            response['cart_reference'] = kwargs['cart_reference']
            response['order_id'] = kwargs['order_id']
            try:
                response['data']['electricity'] = args[0]['provider'] 
            except:
                response['data']['electricity'] = args[0]['disco'].split(",")[0]
            response['api_code'] = args[0]['disco']
            return response
        

    def create_tasks_func(self):
        self.__airtimefoetus__ = self.airtimeParser
        self.__datasubfoetus__ = self.dataParser
        self.__cablesubfoetus__ = self.cableParser
        # self.__electricityfoetus__ = self.electricityParser
        self.progenate = {
                        "airtime": self.__airtimefoetus__ ,
                        "data": self.__datasubfoetus__,
                        "cable": self.__cablesubfoetus__,
                        # "electricity":self.__electricityfoetus__
                        }
        
        return self.progenate[self.__servicetype__]()