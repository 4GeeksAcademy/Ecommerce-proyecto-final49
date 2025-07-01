'''
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
'''
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
import cloudinary.uploader as upload
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from datetime import timedelta
from api.models import db, CartItem, Product, ContactMessage
# import stripe

# stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
api = Blueprint('api', __name__)
CORS(api)
# Allow CORS requests to this API


def set_password(password, salt):
    return generate_password_hash(f'{password}{salt}')

def check_password(pass_hash, password, salt):
    return check_password_hash(pass_hash, f'{password}{salt}')

expire_in_minutes = 10
expires_delta = timedelta(minutes=expire_in_minutes)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        'message': "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    if len(products) <= 0:
        return jsonify({'msg': 'No hay productos'}), 404
    return jsonify([product.serialize() for product in products]), 200


@api.route('/product/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return jsonify(product.serialize()), 200


@api.route('/register', methods=['POST'])
def add_user():
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")

    if not email or not name or not password:
        return jsonify("Para poder crearse una cuenta se necesita la información completa"), 400

    salt = b64encode(os.urandom(32)).decode("utf-8")
    user = User()
    user.email = email
    user.name = name
    user.password = set_password(password, salt)
    user.salt = salt
    # user.role_id = 2
    db.session.add(user)
    try:
        db.session.commit()
        return jsonify("User created"), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f"Error: {error.args}"), 500


@api.route('/login', methods=['POST'])
def handle_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Correo electrónico y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).one_or_none()

    if not user or not check_password(user.password, password, user.salt):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token}), 200


@api.route('/forgot-password', methods=["POST"])
def forgot_password():

    body = request.json
    user = User.query.filter_by(email=body).one_or_none()

    if user:
        additional_claims = {"purpose": "password_reset"}
    reset_token = create_access_token(
        identity=str(user.id),
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=1)
    )

    reset_url = f'{os.getenv("FRONTEND_URL")}/recuperar-contraseña?token={reset_token}'
    message = f"""
        <div>
            <h1>Recupera tu contraseña</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="{reset_url}" target="_blank">Restablecer Contraseña</a>
            <p>Si no solicitaste esto, por favor ignora este correo.</p>
        </div>
    """
    data = {
        "subject": "Recuperación de contraseña",
        "to": body,
        "message": message
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify({"msg": "Si tu correo está en nuestro sistema, recibirás un enlace para recuperar la contraseña."}), 200
    else:
        return jsonify({"msg": "internal error"}), 200


@api.route('/reset-password', methods=["PUT"])
@jwt_required()
def handle_password_reset():
    claims = get_jwt()
    if claims.get('purpose') != "password_reset":
        return jsonify({"msg": "Token inválido para recuperación de contraseña"}), 403

    body = request.get_json()
    new_password = body.get("password")

    if not new_password:
        return jsonify({"msg": "Se requiere una nueva contraseña"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.password = set_password(new_password, user.salt)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200


@api.route('/me', methods=["GET"])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': "no user found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/change-password', methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    current_password = body.get("current_password")
    new_password = body.get("new_password")

    if not current_password or not new_password:
        return jsonify({"msg": "Se requiere la contraseña actual y la nueva contraseña"}), 400

    if not check_password(user.password, current_password, user.salt):
        return jsonify({"msg": "La contraseña actual es incorrecta"}), 401

    user.password = set_password(new_password, user.salt)
    db.session.commit()

    return jsonify({"msg": "Contraseña cambiada exitosamente"}), 200


@api.route('/change-email', methods=["POST"])
@jwt_required()
def change_email():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    new_email = body.get("new_email")
    password = body.get("password")

    if not new_email or not password:
        return jsonify({"msg": "Se requiere el nuevo email y la contraseña actual"}), 400

    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({"msg": "El correo electrónico ya está en uso"}), 409

    if not check_password(user.password, password, user.salt):
        return jsonify({"msg": "La contraseña es incorrecta"}), 401

    user.email = new_email
    db.session.commit()

    return jsonify({"msg": "Email actualizado exitosamente"}), 200

# RUTAS CARRITO DE COMPRAS
@api.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    result = []
    for item in cart_items:
        result.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price
        })
    return jsonify(result), 200


@api.route('/cart', methods=['POST'])
def add_to_cart():
    print("Entró al método addToCart")
    data = request.json
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not user_id or not product_id:
        return jsonify({"msg": "Faltan datos"}), 400

    existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"msg": "Producto agregado al carrito"}), 201


@api.route('/cart/<int:item_id>', methods=['DELETE'])
def delete_cart_item(item_id):
    item = CartItem.query.get(item_id)
    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Item eliminado del carrito"}), 200


@api.route('/cart/clear/<int:user_id>', methods=['DELETE'])
def clear_cart(user_id):
    items = CartItem.query.filter_by(user_id=user_id).all()
    for item in items:
        db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Carrito vaciado"}), 200

# CHECKOUT
@api.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.json
    items = data.get('items', [])

    line_items = []
    for item in items:
        line_items.append({
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': item['product_name'],
                    'metadata': {
                        'product_id': item['product_id']
                 }
                },
                'unit_amount': int(item['price'] * 100)  # Stripe usa centavos
            },
            'quantity': item['quantity'],
        })

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=os.getenv("FRONTEND_URL") + '/success',
            cancel_url=os.getenv("FRONTEND_URL") + '/cancel'
        )
        return jsonify({'url': session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/contact-form', methods =["POST"])
def handleContactForm():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"msg": "Some fields are missing"}), 400
    
    try:
        new_message = ContactMessage(name=name, email=email, message=message)
        
        db.session.add(new_message)
        db.session.commit() 

        print(f"Nuevo mensaje de contacto guardado en DB (PostgreSQL):")
        print(f"  Nombre: {new_message.name}")
        print(f"  Email: {new_message.email}")
        print(f"  Mensaje: {new_message.message}")
        print("-" * 30)

        success_response = {
            "msg": "Message received and saved successfully!",
            "status": "success",
            "data": {
                "id": new_message.id,
                "name": new_message.name,
                "email": new_message.email
            }
        }
        return jsonify(success_response), 200

    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error saving the info in the database: {str(error)}"}), 500 

@api.route ('/get-contactform-info', methods=["GET"])
@jwt_required()
def getContactForm():
    try:

        current_user_claims = get_jwt()
        if not current_user_claims.get("is_admin", False):
            return jsonify({"msg": "Administration role is required"}),403
        all_messages = ContactMessage.query.all()
        
        messages_list = []
        for msg in all_messages:
            messages_list.append({
                "id": msg.id,
                "name": msg.name,
                "email": msg.email,
                "message": msg.message,
            })
        
        return jsonify(messages_list), 200

    except Exception as error:
        print(f"Error al recuperar mensajes de la base de datos: {error}")
        return jsonify({"msg": f"Failed to retrieve messages: {str(error)}"}), 500