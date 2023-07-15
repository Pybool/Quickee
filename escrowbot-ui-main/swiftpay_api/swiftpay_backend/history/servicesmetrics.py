
from ..history.airtime_history import AirtimeHistoryUtils
from ..history.data_history import DataHistoryUtils
from ..history.cable_history import CableHistoryUtils
from ..history.electricity_history import ElectricityHistoryUtils

class Metrics(object):
    
    def airtimeRechargeMetrics(self,uid,timeframe,provider):
        self.airtimehistoryutils = AirtimeHistoryUtils()
        return self.airtimehistoryutils.filterAirtimeHistoryByPeriod(uid, int(timeframe),provider)

    def dataSubscriptionMetrics(self,uid,timeframe,provider):
        self.datahistoryutils = DataHistoryUtils()
        return self.datahistoryutils.filterDataHistoryByPeriod(uid,int(timeframe),provider)
        
    def cableSubscriptionMetrics(self,uid,timeframe,provider):
        self.cablehistoryutils = CableHistoryUtils()
        return self.cablehistoryutils.filterCableHistoryByPeriod(uid,int(timeframe),provider)

    def electricityRechargeMetrics(self,uid,timeframe,provider):
        self.electricityhistoryutils = ElectricityHistoryUtils()
        return self.electricityhistoryutils.filterElectricityHistoryByPeriod(uid,int(timeframe),provider)