
class CableSubscriptionProcessor(object):
    
    def __init__(self,*args):
        
        task = args[1]
        buyer_id = args[2]
        cart_reference = args[0]
        Mailservice = args[3]
        self.mail = args[5]
        self.cableelectutilityroutine = args[4]
        self.vendResponseHandler = args[6]
        
        cable_subscription_data = {}                  
        cable_subscription_data['tvplan'] = task['servicename']
        cable_subscription_data['iuc:no'] = task['recipient']
        cable_subscription_data['phonenumber'] = '08183490436' # Dummy phone number
        cable_subscription_data['cabletv'] = task['provider'].lower()
        cable_subscription_data['api_provider'] = task['api_provider']
        order_id = task['order_id']

        try:
            response = self.cableelectutilityroutine.cableRoutine(cable_subscription_data,cart_reference,order_id)
            response['cart_reference'] = cart_reference
            response['order_id'] = order_id
            self.vendResponseHandler(response)
            self.constructMail(buyer_id, order_id, task, response,Mailservice)
            
        except Exception as e:
            print("[Error =============>] ",e)
    
    def constructMail(self,buyer_id, order_id, task, response,Mailservice):
        mail_parameters = {}
        mail_parameters['recipient']= ""+ self.mail.return_usermail(buyer_id)
        mail_parameters['subject'] = 'Cable subscription'
        mail_parameters['sender']= "swiftbillspaymentsng@gmail.com"
        mail_parameters['message']= "Your {0} Cable bill was paid".format(task['provider'].split(",")[0])
        mail_parameters['data']= (mail_parameters['subject'],order_id,response['data']['cable_tv'],response['data']['smartcard_number'],response['data']['subscription_plan'].title(),response['data']['phone'],response['data']['amount_charged'])
        Mailservice.send_dispense_mail(mail_parameters,True) 
    