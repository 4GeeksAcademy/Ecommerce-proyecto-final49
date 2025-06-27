'''
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
'''
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import cloudinary.uploader as upload
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token
from datetime import timedelta


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
    salt = b64encode(os.urandom(32)).decode("utf-8")

    if not email or not name or not password:
        return jsonify("Para poder crearse una cuenta se necesita la información completa"), 400

    user = User()
    user.email = email
    user.name = name
    user.password = set_password(password, salt)
    user.salt = salt

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
        return jsonify("Correo electronico y contraseña son requeridos"), 400

    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify("credenciales incorrectas"), 400

    if check_password(user.password, password, user.salt):
        token = create_access_token(identity=user.id)
        return jsonify({
            "token": token
        }), 200
    else:
        return jsonify({"msg": "Credenciales incorrectas"}), 400