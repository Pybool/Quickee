from django.urls import include, path
from .views import Pricelist, PricelistMetadata

urlpatterns = [
   path('pricelist_metadata/',PricelistMetadata.as_view()),
   path('pricelist/<str:service>/<str:api_provider>/<service_provider>', Pricelist.as_view()),
]
