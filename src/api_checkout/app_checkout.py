# src/api_checkout/app_checkout.py
from flask import Flask
from routes_checkout import checkout_bp

app = Flask(__name__)
app.register_blueprint(checkout_bp, url_prefix="/checkout")

@app.route("/")
def home():
    return "🧾 Servidor de checkout activo"

if __name__ == "__main__":
    app.run(port=5002, debug=True)
