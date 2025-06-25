# src/api_checkout/app_checkout.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_swagger import swagger

from api_checkout.checkout import checkout_api  

app = Flask(__name__)
CORS(app)  # Para que puedas hacer peticiones desde React

# DB simulada (no necesaria si solo haces pruebas locales)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Registrar el blueprint de tu API
app.register_blueprint(checkout_api, url_prefix="/api")

# Endpoint base
@app.route("/")
def index():
    return jsonify({"msg": "API de Checkout activa"}), 200

# Swagger opcional
@app.route("/spec")
def spec():
    return jsonify(swagger(app))

# Arranque del servidor local
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3005))
    app.run(host="0.0.0.0", port=PORT, debug=True)
