from celery import shared_task
from escrowapp.models import Order, Transactions
from escrowapp.paystack_api import check_payment_status

@shared_task
def check_payment_confirmation():
    orders = Order.objects.filter(payment_received=False)
    if orders:
        for order in orders.values('id'):
            try:
                transaction = Transactions.objects.get(order_id=order['id'])
                status = check_payment_status(transaction.transaction_ref)
                if status == 'success':
                    Order.objects.filter(id=order['id']).update(**{'payment_received':True})
            except Exception as e:
                print(str(e))
    else:
        pass
