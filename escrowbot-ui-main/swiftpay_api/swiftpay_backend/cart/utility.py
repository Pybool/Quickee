import json
from django.db import transaction
from swiftpay_backend.serializer import *
from swiftpay_backend.models.transaction_cart_model import *
from swiftpay_backend.cart.service_dispenser import ServiceDispenser


class Utility(object):
    cart_items_length = None
    def parseCart(self, cart):
        
        # try:
        if cart:

            cart_reference = json.loads(cart)['cart_reference']
            cart_items = json.loads(cart)['cartitems'] #Convert cart from Angular app to json
            cart_order_uids = list(cart_items.keys()) # Get all order id's and convert dict_keys to Array 
            Utility.cart_items_length = len(cart_order_uids)
            buyer_id = json.loads(cart)['public_id'] # Convert order_id to json object
            iter_obj = iter(cart_order_uids) # Create a new Iterator object to iterate through the order id's Array
            self.transactioncart = TransactionCart() # Initialize Transaction cart Instance
           
            """
            The While loop block iterates the iterator getting individual cart items using next() generator, 
            the cart items service types are checked and a Cart_item dict (which is inserted into the database)
            is updated on each iteration .
            """
            while True: 
                try:
                    
                    order_id = next(iter_obj)
                    cart_item = cart_items[''+order_id]
                    
                    """The If blocks updates the cart to be saved in the database based on service type"""
                    if cart_item['service'] == "Data subscription" and isinstance(int(cart_item['provider']), int):
                        network = NetworkProviders.objects.filter(public_id=cart_item['provider']).values("isp_name")
                        cart_item['provider'] = network.first()['isp_name']
                    
                    elif cart_item['service'] == "Cable subscription" and isinstance(int(cart_item['provider'].split(",")[1]), int):
                        cable = CableTvProviders.objects.filter(public_id=cart_item['provider'].split(",")[1]).values("cabletv_name")
                        cart_item['provider'] = cable.first()['cabletv_name']
                        
                    elif cart_item['service'] == "Electricity purchase":
                        
                        """This code block parses the electricty provider (which consists of the provider code and the database id ) from the cart  """
                        if isinstance(int(cart_item['provider'].split(',')[2]), int): 
                            provider_index = int(cart_item['provider'].split(',')[2])
                            provider_code = str(cart_item['provider'].split(',')[4])
                            disco = ElectricityDiscos.objects.filter(public_id=provider_index).values("disco_name","api_code")
                            provider_name_index_apicode = disco.first()['disco_name']+","+ str(provider_index)+"$"+disco.first()['api_code']
                            cart_item['provider'] = provider_name_index_apicode
                        else:
                            pass
                        
                    print("[Cart] ======> ", cart_item)
                    """check if order exists already to deterrmine whether to skip or not """
                    try:
                        TransactionCart.objects.get(order_id=""+order_id)
                        pass
                    except TransactionCart.DoesNotExist:
                        result = None
                        self.transactioncart.insertCart(buyer_id,order_id,cart_item,cart_reference)
                        self.transactioncart.returncartinsertion()
                    
                except Exception as e:
                    break
        # except Exception as e:
        #     print("An error ocurred ",e)
            
    """ 
    The Service delegator simply calls the service dispenser class, passing along with the call relevant arguments and returns True when done dispensing,
    and called by the payments.py PaymentVerify class after a successful payment
    """
    def serviceDelegator(self, buyer_id, cart_reference, cart_items_length):
        try:
            services = ['airtime','data','cable','electricity']
            servicedispenser = ServiceDispenser()
            val = servicedispenser.start(buyer_id, cart_reference, cart_items_length)
            print("Service dispenser started ==> ",servicedispenser,cart_items_length)
            return {'status':True, 'data':val,"msg":100}
        except Exception as e:
            print("\n\n\ndelegator  "+e) 

    def deleteCartItem(self, order_id, buyer_public_id):
        self.transactioncart = TransactionCart()
        status = self.transactioncart.deletecartitem(order_id, buyer_public_id)
        return status
       
