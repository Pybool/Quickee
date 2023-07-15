from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..system.resolve_pending import ResolvependingWorker

class ResolvePendingRoute(APIView):
    def post(self, request):
        # try:
            data=request.data
            data = data['order_data']
            if data:
                return Response(ResolvependingWorker(data), status=status.HTTP_200_OK)
            else:
                return Response({"status": False, "data": "Enter valid data"}, status=status.HTTP_400_BAD_REQUEST)
        