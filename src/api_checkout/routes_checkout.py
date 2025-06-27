# src/api_checkout/routes_checkout.py
from flask import Blueprint, jsonify
from paypal_client_checkout import create_order, capture_order

checkout_bp = Blueprint("checkout", __name__)

@checkout_bp.route("/create-order", methods=["POST"])
def create_order_route():
    order = create_order()
    return jsonify({"id": order["id"]})

@checkout_bp.route("/capture-order/<order_id>", methods=["POST"])
def capture_order_route(order_id):
    result = capture_order(order_id)
    return jsonify(result)
