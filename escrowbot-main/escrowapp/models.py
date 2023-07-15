from django.db import models

# Create your models here.

class Order(models.Model):
    
    order_public_id = models.CharField(verbose_name='order public id', max_length=255, unique=True)
    order_units = models.IntegerField(default=1)
    seller_email = models.EmailField(verbose_name='email address', max_length=255)
    buyer_email = models.EmailField(verbose_name='email address', max_length=255)
    description = models.TextField(verbose_name='Description', max_length=255)
    image = models.FileField(upload_to='chat_attachments/images/orders/%Y/%m/%d/', null=True, blank=True)
    agreed_price = models.DecimalField(default=0.00, decimal_places=2,max_digits=10)
    unit_price = models.DecimalField(default=0.00, decimal_places=2,max_digits=10)
    escrow_fee = models.DecimalField(default=250.00, decimal_places=2,max_digits = 10)
    is_buyer_approved = models.BooleanField(default=False)
    complaints =  models.TextField(default='')
    status = models.CharField(verbose_name='Status', max_length=255,default="processing")
    payment_channel = models.CharField(verbose_name='Payment Channel', max_length=255,default="Debit Card")
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(auto_now_add=True)
    
class Transactions(models.Model):
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    transaction_ref = models.CharField(verbose_name='transaction reference', max_length=255, unique=True)
    transaction = models.JSONField(default=dict())
    
class VendorPaymentpool(models.Model):
    order_public_id = models.CharField( max_length=255, unique=True)
    vendor_name = models.CharField( max_length=255)
    vendor_account_no = models.CharField( max_length=255)
    vendor_email = models.CharField( max_length=255)
    vendor_paystack_customer_no = models.CharField( max_length=255,default='')
    bankname = models.CharField( max_length=255,default='')
    settlement_amount = models.DecimalField(default=0.00, decimal_places=2,max_digits=10)
    