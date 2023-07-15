import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction

class TransactionCart(models.Model):

   buyer_public_id = models.CharField(max_length=100)
   order_id = models.CharField(max_length=100,unique=True)
   service = models.CharField(max_length=100, blank=True, null=True)
   provider = models.CharField(max_length=100, blank=True, null=True)
   recipient = models.CharField(max_length=100, blank=True, null=True)
   phone_number = models.CharField(max_length=100, blank=True, null=True)
   servicename = models.CharField(max_length=100, blank=True, null=True)
   amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
   cart_reference = models.CharField(max_length=500, blank=True, null=True)
   payment_status = models.BooleanField(default = False)
   date_time = models.CharField(max_length=100)
   vend_status = models.BooleanField(default = False)
   failure_reason = models.CharField(max_length=500, blank=True, null=True)
   timestamp = models.FloatField(blank=True, null=True)
   mode = models.CharField(max_length=100, blank=True, null=True)
   payment_status =  models.BooleanField(default = False) # Only direct mode uses this field to store payment status, cart mode does not use this field at all
   api_provider = models.CharField(max_length=100, blank=True, null=True)
   
   @staticmethod 
   def returnphonenumber(order_id):   
       return TransactionCart.objects.only('phone_number').get(order_id= order_id).phone_number
    
   @transaction.atomic()
   def insertCart(self,buyer,order_id,data,cart_reference):
       self.buyer_public_id = buyer
       self.order_id = order_id
       self.amount = data['amount']
       self.service = data['service']
       self.provider = data['provider']
       self.recipient = data['recipient']
       self.servicename = data['servicename']
       self.cart_reference = cart_reference
       print('.......................................',data['api_provider'])
       try:
          self.phone = data['phonenumber']
       except Exception as e:
          self.phone = data['recipient']
          print('.......................................',data['api_provider'])
       cart = TransactionCart(  
                                buyer_public_id = buyer,order_id = order_id, amount = data['amount'],
                                service = data['service'],provider = data['provider'],recipient = data['recipient'],
                                servicename = data['servicename'],cart_reference = cart_reference, timestamp = time.time(),
                                phone_number = self.phone, mode = "cart_mode", api_provider = data['api_provider']
                                 
                              )
       cart.save()
       
#    @transaction.atomic()
   def deletecartitem(self, item_order_id, buyer_public_id):
       print("Cart item deletion attempted ")
       self.delete_status = TransactionCart.objects.filter(order_id=item_order_id, buyer_public_id=buyer_public_id).delete()
       print("Cart item deleted ?? ",self.delete_status)
       print(list(self.delete_status[1].keys()))
       delete_status_key = list(self.delete_status[1].keys())[0]
       print(delete_status_key)
       if self.delete_status[1][''+delete_status_key] == 1:
           return {'status':True, 'data': item_order_id, 'message': "Cart item was deleted"}
       return {'status':False, 'data': item_order_id, 'message': "Cart item could not be deleted"}
   
   def returncartinsertion(self):
       cartinsertion = ( 
                self.buyer_public_id ,self.order_id ,self.amount ,
                self.service ,self.provider ,self.recipient ,self.servicename
                )
       print("Database cart insertions", cartinsertion)
       return cartinsertion
   
   def update_vend_status(self,order_id):
      
      self.vendstatus = TransactionCart.objects.filter(order_id=order_id).update(vend_status=True)

   
   def update_failure_reason(self,order_id,reason):
      self.failure_reason = TransactionCart.objects.get(order_id=order_id)
      self.failure_reason = reason
      self.failure_reason.save(['failure_reason'])

#    def __str__(self):
# 	   return str({"order_id":self.order_id, "buyer":self.buyer_public_id})
# TransactionCart.objects.filter(buyer_public_id='a60a0e03-d1dc-4aef-8290-6e951c4efe7a')