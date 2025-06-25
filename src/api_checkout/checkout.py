from flask import Blueprint, request, jsonify

checkout_api = Blueprint('checkout_api', __name__)

# Simula la recepción de un pago
@checkout_api.route('/checkout/pago', methods=['POST'])
def procesar_pago():
    data = request.get_json()
    
    nombre = data.get("nombre")
    tarjeta = data.get("tarjeta")
    monto = data.get("monto")
    
    if not nombre or not tarjeta or not monto:
        return jsonify({"error": "Faltan datos del formulario"}), 400

    if len(str(tarjeta)) < 12:
        return jsonify({"error": "Número de tarjeta inválido"}), 400

    return jsonify({
        "msg": "Pago procesado correctamente",
        "nombre": nombre,
        "monto": monto
    }), 200
