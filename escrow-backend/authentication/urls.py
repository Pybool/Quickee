from django.urls import include, path
from .views import *

urlpatterns = [
   path('register', RegisterUserAPIView.as_view()),
   path('login', LoginAPIView.as_view()),
   path('profile', UserProfileView.as_view()),
   path('merchant-profile', MerchantProfileView.as_view()),
   path('send_otp', OtpView.as_view()), 
   path('user-exists', CheckUserExists.as_view()), 
   path('become-vendor-transactions', MakeUserVendorView.as_view()), 
   path('upload-profile-pic', UploadProfilePictureView.as_view(), name='upload-profile-pic'),
]