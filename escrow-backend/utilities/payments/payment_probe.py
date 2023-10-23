import os, requests
from dotenv import load_dotenv
load_dotenv()
productionmode = str(os.getenv("PRODUCTION_MODE"))
PAYSTACK_SECRET_KEY = None

if productionmode == "True":PAYSTACK_SECRET_KEY = str(os.getenv("LIVE_PAYSTACK_SECRET_KEY"))
if productionmode == "False":PAYSTACK_SECRET_KEY = str(os.getenv("TEST_PAYSTACK_SECRET_KEY"))
# PAYSTACK_SECRET_KEY = "sk_test_4c18e79c7f6675bb9cfb9ffdc82faa65a024b12f"
class Utility(object):

    def verifyWithPaystack(self, reference):
        
        try:
            # data=request.data
            headers = {'Authorization': 'Bearer '+PAYSTACK_SECRET_KEY}
            verfication_endpoint = "https://api.paystack.co/transaction/verify/{0}".format(reference)
            response = requests.get(verfication_endpoint, headers=headers)
            response = response.json()
            print("Payment verification ",response)
            # if response:
            print(response['status'] , response['data']['reference']==reference)
            if response['status'] and response['data']['reference']==reference:
                return {"status": True, "data": response['data']}
            else:
                return {"status": False, "data": response['message']}
            
        except Exception as e:
            print("An error ocurred while verifying response ",e)