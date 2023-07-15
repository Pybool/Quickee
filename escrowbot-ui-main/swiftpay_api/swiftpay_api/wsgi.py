"""
WSGI config for swiftpay_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swiftpay_api.settings')
"""Run the code below first before anything else on loading the app"""
###################################################################################
from swiftpay_backend.system.bootstrapservices import ServicesInitializer, PROCEED_PERM_X
servicesInitializer = ServicesInitializer()
from swiftpay_backend.system.bootstrapservices import PROCEED_PERM_X #Do not move the line of code at all
print("Flush permission is",PROCEED_PERM_X)
print("Waiting for requests....")
if PROCEED_PERM_X:
    print("doings ooooo")
    servicesInitializer.insertairtimeservicedata()
    servicesInitializer.insertdataservicedata()
    servicesInitializer.insertcableservicedata()
    servicesInitializer.insertelectricityservicedata()
###################################################################################
application = get_wsgi_application()
