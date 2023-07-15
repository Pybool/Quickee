from django.urls import include, path
from utilities.views.views import *
from utilities.views.datasubscription_view import *
from utilities.views.airtimepurchase_view import *
from utilities.views.cablesubscription_view import *

urlpatterns = [
   path('getnetworkproviders', GetNetworkProviderView.as_view()),
   path('getdatasubscription/<str:uid>', GetDataSubscriptionView.as_view()),
   path('purchase/airtime', AirtimeSubscription.as_view()),
   path('purchase/data', DataSubscription.as_view()),
   path('purchase/cable', CableTvSubscription.as_view()),
   
   path('getcabletvproviders', GetCableTvProvidersView.as_view()),
   path('getcabletvbouquets', GetCableTvBouquetsView.as_view()),
   
   
   
   
   
]