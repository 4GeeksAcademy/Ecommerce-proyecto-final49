# src/api_cart/routes_cart.py
from flask import Blueprint, jsonify, request

cart_bp = Blueprint("cart_cart", __name__)

# Ruta de prueba para verificar si el backend responde
@cart_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Carrito activo y funcionando"}), 200

# Ruta POST para simular recepción de datos del carrito
@cart_bp.route("/add", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    if not data or "product" not in data:
        return jsonify({"error": "Faltan datos del producto"}), 400

    product = data["product"]
    return jsonify({
        "message": "Producto recibido correctamente",
        "producto": product
    }), 200

# Ruta para ver carrito simulado (en memoria básica)
@cart_bp.route("/dummy-cart", methods=["GET"])
def dummy_cart():
    fake_cart = [
        {"id": 1, "name": "Zapatos", "price": 49.99, "quantity": 2},
        {"id": 2, "name": "Camisa", "price": 25.00, "quantity": 1}
    ]
    return jsonify(fake_cart), 200
