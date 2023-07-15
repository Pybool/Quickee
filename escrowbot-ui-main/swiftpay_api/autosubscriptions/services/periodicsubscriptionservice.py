from django.db import transaction
from autosubscriptions.model import Plans,Customers
from autosubscriptions.models.cable_periodic_subscriptions_model import CablePeriodicSubscriptions
from autosubscriptions.models.data_periodic_subscriptions_model import DataPeriodicSubscriptions
from autosubscriptions.models.airtime_periodic_subscriptions_model import AirtimePeriodicSubscriptions
from autosubscriptions.models.electricity_periodic_subscriptions_model import ElectricityPeriodicSubscriptions

def getKeysByValue(dictOfElements, valueToFind):
    untouchedfields = list()
    listOfItems = dictOfElements.items()
    for item  in listOfItems:
        if item[1] == valueToFind:
            untouchedfields.append(item[0])
    return  untouchedfields

def editModeParser(data):
    __temp__ = list()
    data = data['data']
    untouchedfields = getKeysByValue(data,'')
    #Iterate over the list of untouched fields
    for key  in untouchedfields:
        print(key)
        __temp__.append(key)
        data.pop(key)
    print(data)
    return data

class AirtimeSubscriber(object):
    
    @transaction.atomic()
    def create(data):
        data.pop('subscriptions_service')
        data['plan'] = Plans.objects.get(plan_code=data['plan'])
        data['customer'] = Customers.objects.get(paystack_customer_id=data['customer'])
        airtimeSubscriber = AirtimePeriodicSubscriptions(plan = data['plan'],customer = data['customer'],network = data['network'])
        airtimeSubscriber.save()
        return [True,'Saved successfully']

    def update(data):
        parseddata = editModeParser(data)
        print("Modified data ", parseddata)
        return AirtimePeriodicSubscriptions.update(data)

class DataSubscriber(object):
    
    @transaction.atomic()
    def create(data):
        data.pop('subscriptions_service')
        data['plan'] = Plans.objects.get(plan_code=data['plan'])
        data['customer'] = Customers.objects.get(paystack_customer_id=data['customer'])
        dataSubscriber = DataPeriodicSubscriptions(plan = data['plan'],customer = data['customer'],network = data['network'])
        dataSubscriber.save()
        return [True,'Saved successfully']

    def update(data):
        parseddata = editModeParser(data)
        return DataPeriodicSubscriptions.update(data)

class CableSubscriber(object):
    
    @transaction.atomic()
    def create(data):
        data.pop('subscriptions_service')
        data['plan'] = Plans.objects.get(plan_code=data['plan'])
        data['customer'] = Customers.objects.get(paystack_customer_id=data['customer'])
        cableSubscriber = CablePeriodicSubscriptions(plan = data['plan'],customer = data['customer'],network = data['network'])
        cableSubscriber.save()
        return [True,'Saved successfully']

    def update(data):
        parseddata = editModeParser(data)
        return CablePeriodicSubscriptions.update(data)
    
class ElectricitySubscriber(object):
    
    @transaction.atomic()
    def create(data):
        data.pop('subscriptions_service')
        data['plan'] = Plans.objects.get(plan_code=data['plan'])
        data['customer'] = Customers.objects.get(paystack_customer_id=data['customer'])
        electricitySubscriber = ElectricityPeriodicSubscriptions(plan = data['plan'],customer = data['customer'],disco = data['network'])
        electricitySubscriber.save()
        return [True,'Saved successfully']

    def update(data):
        parseddata = editModeParser(data)
        return ElectricityPeriodicSubscriptions.update(data)