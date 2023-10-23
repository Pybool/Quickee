from django.urls import include, path
from .views import *

urlpatterns = [
   path('orders', OrderView.as_view()),
   path('orders-metadata', OrderMetaDataView.as_view()),
   path('merchant-orders', MerchantOrderView.as_view()),
   path('transactions', TransactionView.as_view()),
   path('report-vendor-order', ReportVendorOrderView.as_view()),
   path('non-cards-webhooks', NonCardPaymentsWebhook.as_view()),
   
   
   
]