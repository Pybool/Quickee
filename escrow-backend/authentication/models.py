import os
from django.db import models
from django.dispatch import receiver
from django.utils import timezone
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
from django.contrib.auth.models import PermissionsMixin

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        # extra_fields.setdefault('user_type', 'Buyer')
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('user_type', 'Admin')

        if extra_fields.get('user_type') != 'Admin':
            raise ValueError('Superuser must have user_type=Admin.')

        user =  self._create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser,PermissionsMixin):
    """User model."""
    firstname = models.CharField(max_length=255, null=False, default='Name N/A')
    surname = models.CharField(max_length=255, null=False, default='Name N/A')
    othername = models.CharField(max_length=255, null=False, default='Name N/A')
    username = models.CharField(max_length=255, null=False, default='Name N/A')
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    phone = models.CharField(max_length=255, null=False, default='Name N/A')
    accountno = models.CharField(max_length=255, null=False, default='')
    bankname = models.CharField(max_length=255, null=False, default='')
    country = models.CharField(max_length=255, null=False, default='')
    ig_handle = models.CharField(max_length=255, null=False, default='Name N/A')
    password = models.CharField(max_length=255, null=False, default='1011')
    regdate = models.DateTimeField(auto_now_add=True, null=True)
    paystack_customer_no = models.CharField(max_length=255, null=False, default='')
    transaction_pin_enabled = models.BooleanField(default=False)
    transaction_pin = models.CharField(max_length=255, null=False, default='')
    otp = models.IntegerField(default=0,blank=True, null=True)
    otp_timestamp = models.DateTimeField(blank=True, null = True)
    is_vendor = models.BooleanField(default=False)
    subscription_type = models.CharField(max_length=255, null=False, default='')
    vendor_registration_amount = models.DecimalField(default=0.00, decimal_places=2,max_digits=10)
    current_subscription_transaction = models.JSONField(default=dict())
    profile_pics = models.ImageField(upload_to='images/profile_pics')
    objects = UserManager()

    USERNAME_FIELD = 'email'
    
    def create_user(email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        return Users.objects.create_user(email, password, **extra_fields)
    
    def vendor_name(self):
        return f"{self.firstname} {self.surname} {self.othername}"