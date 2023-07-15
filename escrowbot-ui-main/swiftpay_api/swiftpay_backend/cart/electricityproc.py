from swiftpay_backend.models.electricity_discos_model import ElectricityDiscos

class ElectricityRechargeprocessor(object):
    
    def __init__(self,*args):
        
        task = args[1]
        buyer_id = args[2]
        cart_reference = args[0]
        service = args[5]
        Mailservice = args[3]
        self.mail = args[6]
        self.vendResponseHandler = args[7]
        self.cableelectutilityroutine = args[4]
        
        electricity_purchase_data = {}                  
        electricity_purchase_data['metertype'] = task['servicename']
        electricity_purchase_data['meterID'] = task['recipient']
        electricity_purchase_data['phonenumber'] = '08183490436' # Dummy phone number
        electricity_purchase_data['amount'] = task['amount']
        electricity_purchase_data['api_provider'] = task['api_provider']
        order_id = task['order_id']
        try:
            self.electricitydiscos = ElectricityDiscos()
            electricity_purchase_data['disco'] = self.electricitydiscos.returnapi_code(int(task['provider'].split(",")[1].split("$")[0]))
            electricity_purchase_data['provider'] = task['provider'].split(",")[1].split("$")[1]
            response = self.cableelectutilityroutine.electricityRoutine(electricity_purchase_data,cart_reference,order_id)
            response['cart_reference'] = cart_reference
            response['order_id'] = order_id
            response['api_code1'] = task['provider'].split(",")[1].split("$")[1]
            data = self.vendResponseHandler(response,service)
            print("\n\n\n Data ==================> ",data, response)
            self.constructMail(response,data,buyer_id, order_id, task,Mailservice)
            
            # return data
        except Exception as e:
            print("[Electricity bundling Error =============>] ",e)
            
    def constructMail(self,response,data,buyer_id,order_id,task,Mailservice):

        if response['code'] =="success":
            mail_parameters = {}
            mail_parameters['recipient']= ""+ self.mail.return_usermail(buyer_id)
            mail_parameters['subject'] = 'Electricity purchase'
            mail_parameters['sender']= "swiftbillspaymentsng@gmail.com"
            mail_parameters['message']= "Your {0} Electricity bill was paid".format(task['provider'].split(",")[0])
            token_units = str(data['token'].split(":")[1].lstrip())+ str("  (") + str(data['units_kw_h']) + str(")")
            mail_parameters['data']= (mail_parameters['subject'],order_id,task['provider'].split(",")[0],task['recipient'],token_units,"08183490436",data['amount_charged'])                                                                                                               
            Mailservice.send_dispense_mail(mail_parameters,True)  
                                                                                        
           