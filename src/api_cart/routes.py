from flask import Flask
from api.routes import api
from api_cart.cart import cart_api 

def setup_routes(app):
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(cart_api, url_prefix="/api") 
