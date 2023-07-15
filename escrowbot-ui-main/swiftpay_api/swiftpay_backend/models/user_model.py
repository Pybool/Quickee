from __future__ import unicode_literals
import uuid, time
from datetime import timedelta, datetime
from django.db import models
from django.db import transaction
from django.conf import settings
from django.contrib.auth.models import (
	AbstractBaseUser, PermissionsMixin, BaseUserManager
)
from requests.models import default_hooks


class UserManager(BaseUserManager):
	
	@transaction.atomic
	def _create_user(self, email, password, **extra_fields):
		"""
		Creates and saves a User with the given email,and password.
		"""
		if not email:
			raise ValueError('The given email must be set')
		try:
			# with transaction.atomic():
			user = self.model(email=email, **extra_fields)
			user.set_password(password)
			user.save(using=self._db)
			return user
		except:
			raise
 
	def create_user(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(email, password, **extra_fields)
 
	def create_superuser(self, email, password, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		return self._create_user(email, password=password, **extra_fields)
	  

# Create your models here.

class VerifiedUsers(AbstractBaseUser, PermissionsMixin,models.Model):
	
   public_id = models.CharField(max_length=100)
   firstname = models.CharField(max_length=100, blank = True)
   middlename = models.CharField(max_length=100, blank = True)
   lastname = models.CharField(max_length=100, blank = True)
   username = models.CharField(max_length=100, blank = True)
   default_phonenumber = models.CharField(max_length=100, blank = True)
   email = models.EmailField(max_length=254,unique = True)
   password = models.CharField(max_length=300, default="", null=False)
   auto_data_subscription = models.BooleanField(default=False)
   auto_electricity_subscription = models.BooleanField(default=False)
   auto_cable_subscription = models.BooleanField(default=False)
   isVerified = models.BooleanField(default = False)
   is_admin = models.BooleanField(default = False)
   is_root = models.BooleanField(default = False)
   objects = UserManager()
#    objects = models.Manager()
 
   USERNAME_FIELD = 'email'
   REQUIRED_FIELDS = ['firstname', 'lastname']
   
   def admin(self):
       return self.is_admin
   
   def root(self):
       return self.is_root
   
   def return_usermail(self,uid):
       return VerifiedUsers.objects.only('email').get(public_id=uid).email
    
   @transaction.atomic
   def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email,and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        try:
            # with transaction.atomic():
            user = self.model(email=email, **extra_fields)
            user.set_password(password)
            user.save(using=self._db)
            return user
        except:
            raise

   @property
   def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()
       
