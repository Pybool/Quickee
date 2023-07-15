from django.contrib import admin

# Register your models here.

from swiftpay_backend.models.network_providers_model import NetworkProviders

admin.site.register(NetworkProviders)