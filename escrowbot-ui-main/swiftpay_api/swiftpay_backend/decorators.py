from django.http import HttpResponse
from rest_framework.response import Response
from django.shortcuts import redirect
# from dashboard import views
from django.contrib import messages

def unnauthenticate_user(view_func):
    def wrapper_func(self,request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('dashboards/home')
        else:
            return view_func(self,request, *args, **kwargs)

    return wrapper_func

def allowed_users():
    def decorator(view_func):
        def wrapper_func(self,request, *args, **kwargs):
            print(request.user.admin(),request.user.root())
            if request.user.admin() == False:
                msg = {'status':False,'message':'You are not authorized to perform this action'}
                return Response(msg)
            
            elif request.user.admin() or request.user.root():
                 return view_func(self,request, *args, **kwargs)
                
            else:
                msg = {'status':False,'message':'You are not authorized to perform this action'}
                return Response(msg)
        return wrapper_func
    return decorator
