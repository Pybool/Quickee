import os, ast, random
import asyncio, requests
from functools import wraps
from rest_framework import response
from dotenv import load_dotenv
load_dotenv()
productionmode = str(os.getenv("PRODUCTION_MODE"))
from asyncio.proactor_events import _ProactorBasePipeTransport

class VtungRequestParser(object):

    __servicetype__ = None
    __response__ = None
    def __new__(nil,ops,username,api_password, *args, **kwargs): #Ops is a test variable to be removed 
        
        kwargs = kwargs
        username = username
        api_password = api_password
        setattr(VtungRequestParser, '__servicetype__', args[1])
        loop = VtungRequestParser.get_or_create_eventloop()
        loop.run_until_complete(VtungRequestParser.create_tasks_func(ops,username,api_password,args,kwargs))
        result = VtungRequestParser.__response__ # ast.literal_eval(VtungRequestParser.__response__)
        return result

    @staticmethod
    def get_or_create_eventloop():
        try:
            return asyncio.get_event_loop()
        except RuntimeError as ex:
            if "There is no current event loop in thread" in str(ex):
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return asyncio.get_event_loop()
        
    """fix yelling at me error"""
    def silence_event_loop_closed(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            try:
                return func(self, *args, **kwargs)
            except RuntimeError as e:
                if str(e) != 'Event loop is closed':
                    raise
        return wrapper

    @classmethod
    async def airtimeParser(cls,ops,username,api_password,args,kwargs): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        airtime_endpoint = "https://vtu.ng/wp-json/api/v1/airtime"
        ploads = {'username':username,'password':api_password,'phone':args[0]['phonenumber'],'network_id':args[0]['ntwrk_provider'],'amount':int(args[0]['amount'])/100}
        if productionmode == 'True':
            response = requests.get(airtime_endpoint,params=ploads)
            response = ast.literal_eval(response.text)
            response['cart_reference'] = kwargs['cart_reference']
            response['order_id'] = kwargs['order_id']
            response['message'] = "Airtime recharge successful"
            return response
        
        # """Mock response for development ###########################"""
        elif productionmode == 'False':
            import random
            response_success = {"code":"success","message":"Airtime successfully delivered","data":{"network":args[0]['ntwrk_provider'],"phone":args[0]['phonenumber'],"amount":"NGN"+str(args[0]['amount']),"order_id":"3100"}}            
            response_failure = {"code":"failure","message":"Airtime recharge failed","data":{"network":args[0]['ntwrk_provider'],"phone":args[0]['phonenumber'],"amount":args[0]['amount'],"order_id":"3100"}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(ops,ops)]
            response['cart_reference'] = kwargs['cart_reference']
            response['order_id'] = kwargs['order_id']
            response['message'] = "Airtime recharge successful"
            print("Test mode airtime recharge task completed")
            return response
      
    @classmethod
    async def dataParser(cls,ops,username,api_password,args,kwargs): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
    
        data_endpoint = "https://vtu.ng/wp-json/api/v1/data"
        ploads = {'username':username,'password':api_password,'phone':args[0]['phonenumber'],'network_id':args[0]['ntwrk_provider'].split(",")[0].lower(),'variation_id':args[0]['data_code']}
        print("Live data sub ",ploads)
        if productionmode == 'True':
            response = requests.get(data_endpoint,params=ploads)
            response = ast.literal_eval(response.text)
            response['message'] = "Data subscription successful"
            return response
        
        elif productionmode == 'False':
            """Mock response for development"""
            
            response_success = {"code":"success","message":"Data successfully delivered","data":{"network":args[0]['ntwrk_provider'].upper(),"data_plan":args[0]['data_code'],"phone":args[0]['phonenumber'],"amount":"NGN259","order_id":"2443"}}            
            response_failure = {"code":"failure","message":"Data subscription failed","data":{"network":args[0]['ntwrk_provider'].upper(),"data_plan":args[0]['data_code'],"phone":args[0]['phonenumber'],"amount":"NGN259","order_id":"2443"}}            
            resp_dict = {1:response_success, 2:response_failure}
            response = resp_dict[random.randint(ops,ops)]
            response['message'] = "Data subscription successful"
            print("Test mode data subscription task completed")
            return response

    @classmethod
    async def cableParser(cls,ops,username,api_password,args,kwargs): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        try:
            cable = args[0]['cabletv']
            plan_id = args[0]['tvplan']
            phonenumber = args[0]['phonenumber']
            IUC_number = args[0]['iuc:no']
        except Exception as e:
            cable = args[0]['provider'].split(",")[0].lower()
            plan_id = args[0]['servicename']
            phonenumber = args[0]['phonenumber']
            IUC_number = args[0]['recipient']
        
        ploads = {'username':username,'password':api_password,'phone':phonenumber,'service_id':cable,'smartcard_number':IUC_number,'variation_id':plan_id}
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
            response = resp_dict[random.randint(ops,ops)]
            response['cart_reference'] = kwargs['cart_reference']
            response['order_id'] = kwargs['order_id']
            response['message'] = "Cable subscription successful"
            return response
    
    @classmethod
    async def electricityParser(cls,ops,username,api_password,args,kwargs): #args[0] ==> data payload, args[1] ==> cart_reference , args[2] ==> order_id
        
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
        
    @classmethod
    async def create_tasks_func(cls,ops,username,api_password,args,kwargs):
        __tasks__ = list()
        __airtimefoetus__ = lambda : asyncio.create_task(VtungRequestParser.airtimeParser(ops,username,api_password,args,kwargs))
        __datasubfoetus__ = lambda : asyncio.create_task(VtungRequestParser.dataParser(ops,username,api_password,args,kwargs))
        __cablesubfoetus__ = lambda : asyncio.create_task(VtungRequestParser.cableParser(ops,username,api_password,args,kwargs))
        __electricityfoetus__ = lambda : asyncio.create_task(VtungRequestParser.electricityParser(ops,username,api_password,args,kwargs))
        progenate = {
                        "airtime": __airtimefoetus__ ,
                        "data": __datasubfoetus__,
                        "cable": __cablesubfoetus__,
                        "electricity":__electricityfoetus__
                        }
        
        print("service type ", VtungRequestParser.__servicetype__)
        response = __tasks__.append((progenate['{0}'.format(VtungRequestParser.__servicetype__)]()))
        # response = await asyncio.gather(progenate['{0}'.format(VtungRequestParser.__servicetype__)]())
       
        response = await asyncio.wait(__tasks__)
        response =  await asyncio.gather(__tasks__[0]) # A bug to rectify, this will always return the return value of the first task
        setattr(VtungRequestParser, '__response__', response[0])
        
  
    
