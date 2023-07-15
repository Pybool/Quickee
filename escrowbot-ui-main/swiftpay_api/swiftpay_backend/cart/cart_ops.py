
from rest_framework.views import APIView
from rest_framework.response import Response
from .utility import Utility

"""This route is called anytime a user adds to cart"""
class AddToCart(APIView):
    
    def post(self, request):
        try:
            data=request.data
            
            if data:
                self.utility = Utility()
                print("=====================================================> ",data)
                self.utility.parseCart(data['data'])
                return Response({"status": True, "data": "Cart data was received"})
            else:
                return Response({"status": False, "data": "Enter valid data"})
        except Exception as e:
            return Response({"status": False, "data": e})


class DeleteFromCart(APIView):
    
    def post(self, request):
        try:
            data=request.data
            if data:
                self.utility = Utility()
                print("Deletion =====================================================> ",type(data['item_id']), data['buyer_id'])
                # data = json.loads(data)
                response = self.utility.deleteCartItem(data['item_id'], data['buyer_id'])
                return Response(response)
            else:
                return Response({"status": False, "data": "Enter valid data"})
        except Exception as e:
            return Response({"status": False, "data": e})