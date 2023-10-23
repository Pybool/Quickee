import os,requests
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')

def check_payment_status(transaction_reference):
    # Make an API request to Paystack to check the payment status
    # Adjust the API endpoint and authentication headers based on your Paystack implementation
    response = requests.get(f'https://api.paystack.co/transaction/verify/{transaction_reference}?external=1', headers={
        'Authorization': F'Bearer {PAYSTACK_SECRET_KEY}',
    })

    # Extract the status from the API response
    if response.status_code == 200:
        data = response.json()
        return data.get('data', {}).get('status', '')
    else:
        # Handle API request errors appropriately
        return 'error'
