# src/api_cart/app_cart.py
from flask import Flask
from routes_cart import cart_bp

app = Flask(__name__)

# Ruta raíz para que no devuelva "Not Found"
@app.route("/")
def home():
    return (
        "<h3>✅ Servidor del carrito está activo</h3>"
        "<p>Visitá <a href='/cart/ping'>/cart/ping</a> para probar.</p>"
    )

# Registramos el blueprint del carrito
app.register_blueprint(cart_bp, url_prefix="/cart")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
