from datetime import datetime
import os, jwt, datetime
from django.utils.crypto import get_random_string
from authentication.models import Users as User
from dotenv import load_dotenv
from django.conf import settings

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
load_dotenv()
algorithm = 'HS256'
# jwt_token_life = int(os.getenv("JWT_TOKEN_LIFE"))
jwt_token_secret_key = settings.SECRET_KEY

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
        
        def decode_access_token(token):
            try:
                print("toks ", token)
                payload = jwt.decode(token,jwt_token_secret_key,algorithms=algorithm)
                return payload['user_id']
            except Exception as e:
                raise exceptions.AuthenticationFailed('Unauthenticated user')
        
        token = get_authorization_token(request,auth)
        id = decode_access_token(token)
        print(id)
        user = User.objects.get(pk=id)
        print("\n\n\nCurrent user ",user)
        return (user, None)