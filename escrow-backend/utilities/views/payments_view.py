from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from swiftpay_backend.serializers import *
from swiftpay_backend.models.transaction_cart_model import *
from swiftpay_backend.cart.utility import Utility as CartUtility
from django.contrib.auth import login
from ..helpers.tokens import account_activation_token
confirmationtoken = None
from ..payments.payment_probe import Utility

class VerifyPayments(APIView):
    def post(self, request):
        try:
            
            self.utility = Utility()
            response = self.utility.verifyWithPaystack(request.data['reference'])
            if response['status']:
                if request.data['cart_reference'] != "":
                    with transaction.atomic():
                        payment_status = TransactionCart.objects.filter(buyer_public_id = request.data['orderRef']).update(payment_status=True)
                    
                    self.cartutility = CartUtility()
                    cart_items_length = self.cartutility.cart_items_length
                    response = self.cartutility.serviceDelegator(request.data['orderRef'], request.data['cart_reference'],cart_items_length) # The service delegator takes the user id and cart reference as
                    
                    try:
                        # print('Delegator response ',response['msg'])
                        return Response({ "status": True,  "message": "Merchant has received funds " })
                    
                    except Exception as e:
                        print("object err ",e)
                    return None
                else:
                    return Response({ "status": True,  "message": "Merchant has received funds for direct purchase","method":"direct" })
            else:
                return Response({ "status": False,  "message": "Merchant did not receive funds" })
                   
        except Exception as e:
            return Response({"status": False, "datar": str(e)})
            
        