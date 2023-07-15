from django.urls import path
from autosubscriptions.views import *
from autosubscriptions.admin import *


urlpatterns = [
   path('periodicsubscriber/fetch', GetPeriodicSubscriber.as_view()), 
   path('periodic_subscribers', PeriodicSubscribers.as_view()),
   path('periodicsubscriber/edit', EditPeriodicSubscriber.as_view()),
   path('periodicsubscriber/delete', DeletePeriodicSubscriber.as_view()), 
   path('periodicplans', PlansView.as_view()),
   path('customers', Customers.as_view()),
   path('customers', Customers.as_view()),
   
]

