from django.urls import include, path
from rest_framework import routers
from swiftpay_backend.views.webhooks import PaystackWebHooks
from swiftpay_backend.cart.cart_ops import AddToCart, DeleteFromCart
from swiftpay_backend.views.payments_view import VerifyPayments
from swiftpay_backend.views.admin_views import *
from swiftpay_backend.views.info_feeders_view import *
from swiftpay_backend.views.authentication_view import *
from swiftpay_backend.views.airtimepurchase_view import *
from swiftpay_backend.views.cablesubscription_view import *
from swiftpay_backend.views.datasubscription_view import *
from swiftpay_backend.views.electricitypurchase_view import *
from swiftpay_backend.views.transactionhistory_view import * 
from swiftpay_backend.views.resolve_pending_view import ResolvePendingRoute

router = routers.DefaultRouter()
router.register(r'verifiedusers', VerifiedUsersViewSet)
router.register(r'networkproviders', NetworkProvidersViewSet)
router.register(r'datasubscriptions', DataSubscriptionsViewSet)
router.register(r'cabletvproviders', CableTvProvidersViewSet)
router.register(r'cabletvbouquets', CableTvBouquetsViewSet)
router.register(r'electricitydiscos', ElectricityDiscosViewSet)

urlpatterns = [
   path('', include(router.urls)),
   path('signup', AuthSignup.as_view()),
   path('signin', AuthSignin.as_view()),
   path('add/cart', AddToCart.as_view()),
   path('delete/cartitem', DeleteFromCart.as_view()), 
   path('purchase/airtime', AirtimeSubscription.as_view()),
   path('purchase/data', DataSubscription.as_view()),
   path('payment/verify', VerifyPayments.as_view()),
   path('resolve/pending', ResolvePendingRoute.as_view()),
   path('getusermetrics/<uid>/<timeframe>', GetUserMetrics.as_view()),
   path('getnetworkproviders', GetNetworkProvider.as_view()),
   path('getdatasubscription/<int:uid>', GetDataSubscription.as_view()),
   path('getcabletvproviders', GetCableTvProviders.as_view()),
   path('getcabletvbouquets/<int:uid>', GetCableTvBouquets.as_view()),
   path('subscriptions/webhooks', PaystackWebHooks.as_view()),
   
   path('getelectricitydiscos', GetElectricityDiscos.as_view()),
   path('purchase/cable_subscription', CableTvSubscription.as_view()),
   path('purchase/electricity_purchase', ElectricitySubscription.as_view()),
   path('activate/<uidb64>/<token>', ActivateAccount.as_view(), name='activate'),
   path('getairtimehistory/<uid>/<search_by>/<params>/<int:chunk_size>', GetAirtimeHistory.as_view()),
   path('getdatahistory/<uid>/<search_by>/<params>/<int:chunk_size>', GetDataHistory.as_view()),
   path('getcablehistory/<uid>/<search_by>/<params>/<int:chunk_size>', GetCableHistory.as_view()),
   path('getrecentTransactions/<uid>/<int:chunk_size>', GetRecentTransactions.as_view()),
   path('getelectricityhistory/<uid>/<search_by>/<params>/<int:chunk_size>', GetElectricityHistory.as_view()), 
]

