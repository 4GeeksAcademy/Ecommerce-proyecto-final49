from flask import Blueprint, jsonify, request

cart_api = Blueprint('cart_api', __name__)


cart_items = [
    {
        "id": 1,
        "name": "Producto 1",
        "price": 25.99,
        "quantity": 2,
        "image": "https://via.placeholder.com/100"
    },
    {
        "id": 2,
        "name": "Producto 2",
        "price": 15.50,
        "quantity": 1,
        "image": "https://via.placeholder.com/100"
    }
]

# GET: Obteniene los productos del carrito
@cart_api.route('/cart', methods=['GET'])
def get_cart():
    return jsonify(cart_items), 200

# POST: Agrega un nuevo producto al carrito
@cart_api.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    new_item = {
        "id": len(cart_items) + 1,
        "name": data.get("name"),
        "price": data.get("price"),
        "quantity": data.get("quantity", 1),
        "image": data.get("image", "https://via.placeholder.com/100")
    }
    cart_items.append(new_item)
    return jsonify({"msg": "Producto agregado", "item": new_item}), 201

# PUT: Actualiza la cantidad de un producto
@cart_api.route('/cart/<int:item_id>', methods=['PUT'])
def update_cart_item(item_id):
    data = request.get_json()
    for item in cart_items:
        if item["id"] == item_id:
            item["quantity"] = data.get("quantity", item["quantity"])
            return jsonify({"msg": "Cantidad actualizada", "item": item}), 200
    return jsonify({"error": "Producto no encontrado"}), 404

# DELETE: Elimina un producto del carrito
@cart_api.route('/cart/<int:item_id>', methods=['DELETE'])
def delete_cart_item(item_id):
    global cart_items
    cart_items = [item for item in cart_items if item["id"] != item_id]
    return jsonify({"msg": "Producto eliminado"}), 200
