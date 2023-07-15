from dotenv import load_dotenv
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = int(os.getenv("OPS"))
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")
from utilities.parsers.request_parser import *

class CableSubscriptionService(object):
         
    def cableRoutine(self, data):
        
        try:
            self.vtung = VtungRequestParser(ops,username, api_password, data,'cable')
            self.vtudatazone = ''# lambda : VtungRequestParser(data) self.
            ####################################################################### 
            self.api_providers_dict = {'vtung':self.vtung.create_tasks_func, 'vtudatazone':self.vtudatazone}
            response = self.api_providers_dict['{0}'.format(data['api_provider'])]()
            return response
        except Exception as e:
            print("An error ocurred while dispensing cable subscription",str(e)) 
    
    