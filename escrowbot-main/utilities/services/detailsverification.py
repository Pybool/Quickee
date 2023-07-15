from dotenv import load_dotenv
import os, ast, requests #provides ways to access the Operating System and allows us to read the environment variables
load_dotenv()
ops = int(os.getenv("OPS"))
username = os.getenv("API_USERNAME")
api_password = os.getenv("API_PASSWORD")

class DetailsVerificationService(object):
    
    def verifyuserdetails(self, data):
        
        try:
            if data:
                verification_endpoint = "https://vtu.ng/wp-json/api/v1/verify-customer"
                ploads = {'username':username,'password':api_password,'customer_id':data['customer_id'],'service_id':data['serviceprovider'],'variation_id':data['variation_id']}
                response = requests.get(verification_endpoint,params=ploads)
                response = ast.literal_eval(response.text)
                if response['code']=='success' :
                    return {"status": True, "message":response['message'], "data": response['data']}
                else:
                    return {"status": False, "data": response['message']}
        except Exception as e:
            print("An error ocurred ",e)