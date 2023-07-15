
class AirtimeRechargeProcessor(object):
    
    def __init__(self,*args):
        print("\n\n AirtimeRechargeProcessor was called ",args)
        task = args[1]
        buyer_id = args[2]
        cart_reference = args[0]
        Mailservice = args[3]
        self.utilityroutine = args[4]
        self.mail = args[5]
        self.vendResponseHandler = args[6]
        print("\n\n AirtimeRechargeProcessor was initialized")
        airtime_purchase_data = {}
        airtime_purchase_data['amount'] = task['amount']
        airtime_purchase_data['phonenumber'] = task['recipient']
        airtime_purchase_data['ntwrk_provider'] = task['provider'].lower()
        order_id = task['order_id']
        # try:
            
        response = self.utilityroutine.airtimeRecharge(airtime_purchase_data,cart_reference,order_id)
        response['cart_reference'] = cart_reference
        response['order_id'] = order_id
        print("Debugging ",response)
        self.vendResponseHandler(response)
        self.constructMail(buyer_id, order_id, task, response,Mailservice)
        
        # except Exception as e:
        #     print("error occured in airtime ", e)
            
    def constructMail(self,buyer_id, order_id, task, response,Mailservice ):
        mail_parameters = {}
        mail_parameters['recipient']= ""+ self.mail.return_usermail(buyer_id)
        mail_parameters['subject'] = 'Airtime purchase'
        mail_parameters['sender']= "swiftbillspaymentsng@gmail.com"
        # Remove task['provider'], order-id from the line below and every occurence for mail, get the provider from response instead
        mail_parameters['message']= "Your {0} Airtime purchase was successful".format(task['provider']) 
        mail_parameters['data']= (mail_parameters['subject'],order_id,response['data']['network'].split(",")[0],response['data']['phone'],response['data']['amount'],response['data']['phone'],response['data']['amount'])
        Mailservice.send_dispense_mail(mail_parameters,True)
