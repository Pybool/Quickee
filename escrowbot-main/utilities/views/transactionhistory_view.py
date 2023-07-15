import  requests, json
from swiftpay_backend.serializers import *
from datetime import timedelta
from django.utils import timezone
import requests, json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from ..system.services_id import  getData
from ..helpers.generic_helpers import cleanup,convertToNone
from ..history.recent_transactions import *
from ..history.servicesmetrics import Metrics
from ..history.airtime_history import AirtimeHistoryUtils
from ..history.data_history import DataHistoryUtils
from ..history.cable_history import CableHistoryUtils
from ..history.electricity_history import ElectricityHistoryUtils

class GetAirtimeHistory(APIView):
    
    def get(self,request, uid, search_by,params,chunk_size):
        
        mode="route"
        self.getairtimediscount = getData
        self.airtimehistoryutils = AirtimeHistoryUtils()
        try:
            print("Request query ", uid, search_by,chunk_size)    
            if search_by == "phone": 
                return self.airtimehistoryutils.filterAirtimeHistoryByPhone(uid, params)
            elif search_by == "network":
                return self.airtimehistoryutils.filterAirtimeHistoryByNetwork(uid, params)
            elif search_by=='null' and params=='null' and chunk_size !='':
                response = Response(self.airtimehistoryutils.getAllAirtimeHistory(uid,chunk_size,mode), status=status.HTTP_200_OK)
                response['Cache-Control'] = f'max-age={60*60*24}'
                return response

        except Exception as e:
            return Response({"status": False, "message": "Airtime history could not be fetched due to {0}".format(e)})
    
      
class GetDataHistory(APIView):
    
    def get(self,request, uid, search_by,params,chunk_size):
        mode="route"
        self.datahistoryutils = DataHistoryUtils()
        try:
            print("Request query ", uid, search_by)
            if search_by == "phone":
                return self.datahistoryutils.filterDataHistoryByPhone(uid, search_by,params)
            elif search_by == "network":
                return self.datahistoryutils.filterDataHistoryByNetwork(uid, search_by,params)
            elif search_by=='null' and params=='null' and chunk_size !='':
                 return Response(self.datahistoryutils.getAllDataSubscriptionHistory(uid,chunk_size,mode), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": False, "message": "Data subscription history could not be fetched due to {0}".format(e)})
        

class GetCableHistory(APIView):
    
    def get(self,request, uid, search_by,params,chunk_size):
        mode="route"
        self.cablehistoryutils = CableHistoryUtils()
        try:
            print("Request query ", uid, search_by)
            if search_by == "phone":
                return self.cablehistoryutils.filterCableHistoryByIUC(uid, search_by,params)
            elif search_by == "network":
                return self.cablehistoryutils.filterCableHistoryByProvider(uid, search_by,params)
            elif search_by=='null' and params=='null' and chunk_size !='':
                 return Response(self.cablehistoryutils.getAllCableSubscriptionHistory(uid,chunk_size,mode), status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response({"status": False, "message": "Data subscription history could not be fetched due to {0}".format(e)})
        
    

class GetElectricityHistory(APIView):
    
    def get(self,request, uid, search_by,params,chunk_size):
        mode="route"
        self.electricityhistoryutils = ElectricityHistoryUtils()
        try:
            print("Request query ", uid, search_by)
            if search_by == "phone":
                return self.electricityhistoryutils.filterCableHistoryByIUC(uid, search_by,params)
            elif search_by == "network":
                return self.electricityhistoryutils.filterCableHistoryByProvider(uid, search_by,params)
            elif search_by=='null' and params=='null' and chunk_size !='':
                 return Response(self.electricityhistoryutils.getAllElectricityPurchaseHistory(uid,chunk_size,mode), status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response({"status": False, "message": "Data subscription history could not be fetched due to {0}".format(e)})
        
    
class GetRecentTransactions(APIView):
    
    def get(self,request, uid, chunk_size):
        mode="method"
        try:
            request = request
            self.getairtimehistory = AirtimeHistoryUtils()
            self.getdatahistory = DataHistoryUtils()
            self.GetCableHistory = CableHistoryUtils()
            self.getelectricityhistory = ElectricityHistoryUtils()
            self.RecentTransactions = RecentTransactions()
            
            airtime = self.getairtimehistory.getAllAirtimeHistory(uid,chunk_size,mode)
            data = self.getdatahistory.getAllDataSubscriptionHistory(uid,chunk_size,mode)
            cable = self.GetCableHistory.getAllCableSubscriptionHistory(uid,chunk_size,mode)
            electricity = self.getelectricityhistory.getAllElectricityPurchaseHistory(uid,chunk_size,mode)
            recentTransactions = self.RecentTransactions.processor(airtime,data,cable,electricity)
            
            cleanup(self.RecentTransactions.mergedTransactionHistory)
            cleanup(self.RecentTransactions.sorted_mergedTransactionHistory)
            
            if recentTransactions is not False:
                return Response({"status":True,"data":recentTransactions, "message":"Most recent transactions were successfully fetched"}, status=status.HTTP_200_OK)
            else:return Response({"status": False, "message": "Most recent transactions could not be fetched"})
            
        except Exception as e:
            return Response({"status": False, "message": f"An error {e} occured while fetching recent transactions"})
        

class GetUserMetrics(APIView):
    
    def get(self,request, uid, timeframe,provider=None,service=None):
        X_METRICS_DATA = []
        try:
            request = request
            service = convertToNone(service)
            self.metrics = Metrics()
            if service == None:
                self.getairtimehistory = GetAirtimeHistory()
                self.getdatahistory = GetDataHistory()
                self.GetCableHistory = GetCableHistory()
                self.getelectricityhistory = GetElectricityHistory()
                      
                X_METRICS_DATA.append({'airtime':self.metrics.airtimeRechargeMetrics(uid,timeframe,provider)})
                X_METRICS_DATA.append({'data':self.metrics.dataSubscriptionMetrics(uid,timeframe,provider)})
                X_METRICS_DATA.append({'cable':self.metrics.cableSubscriptionMetrics(uid,timeframe,provider)})
                X_METRICS_DATA.append({'electricity':self.metrics.electricityRechargeMetrics(uid,timeframe,provider)})
                
            elif service == 'airtime':
                 self.getairtimehistory = GetAirtimeHistory()
                 X_METRICS_DATA.append(self.metrics.airtimeRechargeMetrics(uid,timeframe,provider))
            elif service == 'data':
                self.getdatahistory = GetDataHistory()
                X_METRICS_DATA.append(self.metrics.dataSubscriptionMetrics(uid,timeframe,provider))
            elif service == 'cable':
                self.GetCableHistory = GetCableHistory()
                X_METRICS_DATA.append(self.metrics.cableSubscriptionMetrics(uid,timeframe,provider))
            elif service == 'electricity':
                self.getelectricityhistory = GetElectricityHistory()
                X_METRICS_DATA.append(self.metrics.electricityRechargeMetrics(uid,timeframe,provider))
                
            response =  Response({"status": True, "message": "Metrics successfully fetched","metrics_data":X_METRICS_DATA}, status=status.HTTP_200_OK)
            response['Cache-Control'] = f'max-age={60*60*24}'
            return response
            
        except Exception as e:
            return Response({"status": False, "message": "An error {0} occured while fetching metrics".format(e)})

        # cleanup(X_METRICS_DATA)
    
    
    # return X_METRICS_DATA