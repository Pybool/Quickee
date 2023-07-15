
class DataSubscriptionProcessor(object):
    
    def __init__(self,*args):
        print("\n\n DataSubscriptionProcessor was called ",args)
        task = args[1]
        buyer_id = args[2]
        cart_reference = args[0]
        Mailservice = args[3]
        self.utilityroutine = args[4]
        self.mail = args[5]
        self.vendResponseHandler = args[6]
        print("\n\n DataSubscriptionProcessor was initilaized ")
        
        data_subscription_data = {}
        data_subscription_data['phonenumber'] = task['recipient']
        data_subscription_data['data_code'] = task['servicename']
        data_subscription_data['ntwrk_provider'] = task['provider'].lower()
        data_subscription_data['api_provider'] = task['api_provider']
        order_id = task['order_id']
 
        try:
            response = self.utilityroutine.dataSubscription(data_subscription_data,cart_reference,order_id)
            response['cart_reference'] = cart_reference
            response['order_id'] = order_id
            self.vendResponseHandler(response)
            self.constructMail(buyer_id, order_id, task, response,Mailservice)
        except Exception as e:
            print("[Error =============>] ",e)
    
    def constructMail(self,buyer_id, order_id, task, response,Mailservice):
        
        mail_parameters = {}
        mail_parameters['recipient']= ""+ self.mail.return_usermail(buyer_id)
        mail_parameters['subject'] = 'Data subscription'
        mail_parameters['sender']= "swiftbillspaymentsng@gmail.com"
        mail_parameters['message']= "Your {0} Data subscription was purchased".format(task['provider'])
        mail_parameters['data']= (mail_parameters['subject'],order_id,response['data']['network'],response['data']['phone'],response['data']['data_plan'],response['data']['phone'],response['data']['amount'])
        Mailservice.send_dispense_mail(mail_parameters,True)
    