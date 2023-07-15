from django.core.mail import send_mail, EmailMultiAlternatives

airtime = ("Airtime recharge","OD-1202870","Etisalat","08183490436","2000","0818349036","2000")
data = ("Data subscription","OD-1202871","Airtel","08127148012","40GB","08127148012","10000")
cable = ("Cable subscription","OD-1202872","DSTV","6781045600","1500","09039063922","1700")
power = ("Electricity recharge","OD-1202873","IBEDC","97304562700","9000","08104300395","9000")

                            
class Mailservice(object):
    receipt_array = [] #Holds a list of tuples
    def __init__(self,cart_items_length):
       
        self.cart_items_length = cart_items_length
        print("Cart length in mail ",self.cart_items_length)
    
    def cleanup(object):
        del object
        
    def send_dispense_mail(self, mail_parameters,multi=False):
        
        try:
            if multi is False:
                mailparameters = mail_parameters
                html_content = Mailservice.buildHtml(mailparameters['data'])
                msg = EmailMultiAlternatives(mailparameters['subject'],mailparameters['message'],
                                            mailparameters['sender'], [mailparameters['recipient']])
                msg.attach_alternative(html_content, "text/html")
                mail_status = msg.send() 
                print("=====================================>>>>>>>Mailservice sent a single mail")
                return mail_status
            
            return self.constructReceipt(mail_parameters['data'])
            
        except Exception as e:
            print("An error ocurred while sending mail ",e)

    def constructReceipt(self,mail_parameters):
        print("constructing receipt")
        if len(Mailservice.receipt_array) < self.cart_items_length:
            Mailservice.receipt_array.append(mail_parameters)
            
            if len(Mailservice.receipt_array) == self.cart_items_length:
                print("Sending mail as cart is emptied ",self.cart_items_length,len(Mailservice.receipt_array))
                mailparameters = mail_parameters
                html_content = Mailservice.buildHtml(Mailservice.receipt_array)
                # msg = EmailMultiAlternatives(mailparameters['subject'],mailparameters['message'],
                #                             mailparameters['sender'], [mailparameters['recipient']])
                # msg.attach_alternative(html_content, "text/html")
                # mail_status = msg.send() 
                print("=====================================>>>>>>>Mailservice sent a receipt \n",html_content)
                Mailservice.cleanup(Mailservice.receipt_array)
                return True
            else:
                print("\n\n\n\n\nMail Fall through as vending isnt done ",Mailservice.receipt_array)
            
    def buildHtml(datatuple_list,mode="cart mode"):
        table_rows = []
        for datatuple in datatuple_list:
            table_row =     f"""<tr>
                                    
                                    <td align="left">{datatuple[0]}</td>
                                    <td align="left">{datatuple[1]}</td>
                                    <td align="left">{datatuple[2].upper()}</td>
                                    <td align="left">{datatuple[3]}</td>
                                    <td align="left">{datatuple[4]}</td>
                                    <td align="left">{datatuple[5]}</td>
                                    <td align="left">{datatuple[6]}</td>
                                </tr>
                            """
            table_rows.append(table_row)
                        
        HTML = """ <!DOCTYPE html>
                    <html>
                        <head style="font-family: Times-roman, times;" align = "center">
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
                            <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
                            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
                            <h1 align = "center">Swift bills online {0} payment receipt</h1>
                            <h2 align = "center">Receipt for purchase cart-ref 84682007556</h2>
                        </head>
                        
                        <body style="font-family: Times-roman, times;" align = "center">
                            <div  align = "center">
                            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                <table style="min-width:780px;max-width:1500px;" class= "table table-striped">
                                    <thead class="thead-dark">
                                        <th align="center">Service rendered</th>
                                        <th align="center">Order no</th>
                                        <th align="center">Service provider</th>
                                        <th align="center">Recipient</th>
                                        <th align="center">Value rendered</th>
                                        <th align="center">Phone number</th>
                                        <th align="center">Amount</th>

                                    </thead>
                                    <tbody>
                                        {1}
                                    </tbody>
                                
                                </table> 
                                ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                <div style="padding-left:750px;"><b>{2}</b></div> 
                                ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            </div>
                        </body>
                        <footer align = "center">
                            <div><b>Thank you for doing business with us, we appreciate you!!</b></div>
                            <p>Note: You can resolve any failed order manually on the website</p>
                        </footer>
                    </html>
                """.format(mode,"".join(table_rows),"Total: NGN "+str(40000))
        return HTML
    
    