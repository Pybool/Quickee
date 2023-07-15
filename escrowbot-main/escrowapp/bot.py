"""Imports"""
import os
import stripe
import tweepy as twitter
from dotenv import load_dotenv
load_dotenv()

"""Environment variabkes"""
API_KEY = os.getenv("API_KEY")
API_KEY_SECRET = os.getenv("API_KEY_SECRET")
BEARER_TOKEN = r"AAAAAAAAAAAAAAAAAAAAAFecoAEAAAAAyYuDNVNEy2sBJ%2B%2FUkSrlzoFyrMY%3DP8J9CfJF7ime3HnE5OvKh68URVTZwXVaRFwrDgi9uv1fJPQ3WR" or os.getenv('BEARER_TOKEN')
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN')
ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')

"""Initializations"""
stripe.api_key = STRIPE_API_KEY
# client = twitter.Client(BEARER_TOKEN,API_KEY,API_KEY_SECRET,ACCESS_TOKEN,ACCESS_TOKEN_SECRET)
auth   = twitter.OAuthHandler(API_KEY,API_KEY_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
twitter_api = twitter.API(auth)

print(BEARER_TOKEN,
      API_KEY,
      API_KEY_SECRET,
      ACCESS_TOKEN,
      ACCESS_TOKEN_SECRET
      )

class Tweets(object):
    
    def __init__(self,message):
        
        self.message = message
        
    def create_tweet(self):
        twitter_api.update_status(self.message)
        
# Listen for mentions
class MentionStreamListener(twitter.StreamingClient):
    def on_status(self, tweet):
        if tweet.in_reply_to_status_id is not None:
            username = tweet.user.screen_name
            status_id = tweet.id
            text = tweet.text

            # Extract payment details from the tweet text
            # For example, you can use a specific hashtag or a keyword to indicate a payment request
            if "#payment" in text:
                # Extract the payment amount
                payment_amount = 10  # Placeholder value, replace with your logic

                # Create a Stripe PaymentIntent
                payment_intent = stripe.PaymentIntent.create(
                    amount=payment_amount,
                    currency="usd",
                    payment_method_types=["card"]
                )

                # Reply to the tweet with payment instructions
                payment_url = payment_intent["charges"]["data"][0]["payment_method_details"]["card"]["receipt_url"]
                reply_text = f"Hi @{username}, please complete your payment of ${payment_amount} at {payment_url}"
                twitter_api.update_status(reply_text, in_reply_to_status_id=status_id)



    def on_error(self, status_code):
        if status_code == 420:
            return False
        
# Create an instance of the MentionStreamListener and start listening
if __name__ == "__main__":
    mention_listener = MentionStreamListener(BEARER_TOKEN)
    mention_stream = mention_listener.add_rules(twitter.StreamRule("@SEscrow20170"))
    mention_listener.filter()
        
# message = "Hello friends, i am Swift Escrow Bot, You me to make payments from strangers and i will be your trusted middle man. Cheers!!!"
# tweet = Tweets(message)
# tweet.create_tweet()

