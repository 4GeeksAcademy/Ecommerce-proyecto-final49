# src/api_checkout/paypal_client_checkout.py
import requests
import base64

PAYPAL_CLIENT_ID = "TU_CLIENT_ID"
PAYPAL_SECRET = "TU_SECRET"
PAYPAL_BASE = "https://api-m.sandbox.paypal.com"

def get_access_token():
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {"grant_type": "client_credentials"}
    response = requests.post(f"{PAYPAL_BASE}/v1/oauth2/token", headers=headers, data=data)
    return response.json()["access_token"]

def create_order():
    token = get_access_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    body = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": "50.00"
                }
            }
        ]
    }
    response = requests.post(f"{PAYPAL_BASE}/v2/checkout/orders", headers=headers, json=body)
    return response.json()

def capture_order(order_id):
    token = get_access_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    response = requests.post(f"{PAYPAL_BASE}/v2/checkout/orders/{order_id}/capture", headers=headers)
    return response.json()
