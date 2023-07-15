from django.core.mail import send_mail, EmailMultiAlternatives
import os

                            
class Mailservice(object):

        
    def otp_code_template():
        return """  
                <div class="col-12">
                    <h2 style="color:blue;">{0}</h2>
                    <h4>Dear {1}</h4>,
                        <p>Your otp code is {2}</p>
                </div>
                """
         
    def send_outwards_mail(mail_parameters):
        
        try:
            templates = {"otp_code_template":Mailservice.otp_code_template,
                         }
            html_content = templates[mail_parameters['ir_template']]()
            html_content = html_content.format(
                                                mail_parameters['subject'],
                                                mail_parameters['recipient'],
                                                mail_parameters['otp_code']
                                                )
            
            msg = EmailMultiAlternatives(mail_parameters['subject'],"",'no-reply-cms@ibedc.com', mail_parameters['recipient'])
            msg.attach_alternative(html_content, "text/html")
            mail_status = msg.send() 
            return mail_status
            
        except Exception as e:
            print("===>",str(e))
        
        
    
       