from dotenv import load_dotenv
import os #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = int(os.getenv("OPS"))
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")
from swiftpay_backend.parsers.request_parser import *

class DataSubscriptionService(object):

    def dataSubscription(self, data,cart_reference='',order_id=''):
                    
        order_id = order_id
        cart_reference = cart_reference
        
        try:
            # Select the Api provider endpoint to use ###########################
            vtung = lambda : VtungRequestParser(ops,username, api_password, data,"data", cart_reference=cart_reference,order_id=order_id)
            vtudatazone = ''# lambda : VtungRequestParser(data,cart_reference='',order_id='') 
            ####################################################################### 
            self.api_providers_dict = {'vtung':vtung, 'vtudatazone':vtudatazone}
            response = self.api_providers_dict['{0}'.format(data['api_provider'])]()
            return response
        except Exception as e:
            print("An error ocurred ",e)