import os, nexmo
NEXMO_API_KEY = os.getenv('VONAGE_API_KEY')
NEXMO_API_SECRET = os.getenv('VONAGE_API_SECRET')

client = nexmo.Client(key=NEXMO_API_KEY, secret=NEXMO_API_SECRET)

def send_sms(data):
    try:
        client.send_message(data)
    except Exception as e:
        print("SMS ERROR ===> ", str(e))