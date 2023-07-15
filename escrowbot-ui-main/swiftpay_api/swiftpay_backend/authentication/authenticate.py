from datetime import datetime
import os, jwt, datetime
from django.utils.crypto import get_random_string
from ..models.user_model import VerifiedUsers
from dotenv import load_dotenv
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
load_dotenv()
algorithm = str(os.getenv("JWT_ALGORITHM"))
jwt_token_life = int(os.getenv("JWT_TOKEN_LIFE"))
jwt_token_secret_key = str(os.getenv("JWT_TOKEN_SECRET_KEY"))
refresh_jwt_token_life = int(os.getenv("REFRESH_JWT_TOKEN_LIFE"))

def get_authorization_token(request,auth):
        auth = get_authorization_header(request).split()
        
        if auth and len(auth)==2:
            print(auth)
            return auth[1].decode('utf-8')
        if auth is True:
            pass
            # raise exceptions.AuthenticationFailed('Unauthenticated')
        return False
    
# Authentication MIDDLEWARE CLASS 
class JWTAuthenticationMiddleWare(BaseAuthentication):
        
    def authenticate(self,request,auth=True):
        
        token = get_authorization_token(request,auth)
        email = decode_access_token(token)
        user = VerifiedUsers.objects.get(email=email)
        return (user, None)
        
        
def create_access_token(payload_object):
    return jwt.encode({
       
        'public_id':payload_object['public_id'],
        'username':payload_object['username'],
        'is_admin':payload_object['is_admin'],
        'is_root':payload_object['is_root'],
        'email':payload_object['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=jwt_token_life),
        'iat':datetime.datetime.utcnow()
    },jwt_token_secret_key,algorithm=algorithm)
    
def decode_access_token(token,cart=False):
    try:
        payload = jwt.decode(token,jwt_token_secret_key,algorithms=algorithm)
        return payload['email']
    except Exception as e:
        raise exceptions.AuthenticationFailed('Unauthenticated user')
        
def create_refresh_token(payload_object):
    
    return jwt.encode({
        'public_id':payload_object['public_id'],
        'username':payload_object['username'],
        'is_admin':payload_object['is_admin'],
        'is_root':payload_object['is_root'],
        'email':payload_object['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=refresh_jwt_token_life),
        'iat':datetime.datetime.utcnow()
    },jwt_token_secret_key,algorithm=algorithm)

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token,jwt_token_secret_key,algorithms=algorithm)
        return payload['user_id']
    except Exception as e:
        raise exceptions.AuthenticationFailed('Unauthenticated user')