'''
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
'''
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, Author, CartItem, ContactMessage, Order, OrderItem, Role
from api.utils import generate_sitemap, APIException, send_email
import cloudinary.uploader as upload
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
import stripe
from .data import users, categories, authors, products, roles
from api.utils import set_password, check_password, validate_email


# stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
api = Blueprint('api', __name__)

# ENDPOINT DEL LOGIN 
@api.route('/register', methods=['POST'])
def add_user():
    data = request.get_json()
    email = data.get("email")
    name = data.get("username")  
    password = data.get("password")

    if not email or not name or not password:
        return jsonify({"msg": "Faltan campos requeridos"}), 400

    if not isinstance(email, str) or not isinstance(name, str) or not isinstance(password, str):
        return jsonify({"msg": "Todos los campos deben ser strings"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El correo ya está registrado"}), 409

    salt = b64encode(os.urandom(32)).decode("utf-8")
    user = User(email=email, name=name, salt=salt)
    user.password = set_password(password, salt)
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario creado"}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"msg": f"Error en el servidor: {error.args}"}), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Correo electrónico y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email).one_or_none()

    if not user or not check_password(user.password, password, user.salt):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    additional_claims = {"role": user.role.name if user.role else "user"}
    token = create_access_token(identity=user.id, additional_claims=additional_claims)

    return jsonify({"token": token, "user": user.serialize()}), 200

@api.route('/forgot-password', methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"msg": "Se requiere un correo válido"}), 400

        user = User.query.filter_by(email=email).one_or_none()

        if user:
            # Usamos la función desde utils.py para modularizar
            return validate_email(user_email=email, user_id=user.id)
        else:
            return jsonify({"msg": "Si tu correo está en el sistema, recibirás un enlace"}), 200

    except Exception as e:
        print("Error en /forgot-password:", e)
        return jsonify({"msg": "Error interno del servidor"}), 500



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
        return jsonify({'msg': "Usuario no encontrado"}), 404
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
        return jsonify({"msg": "Faltan campos"}), 400

    if not check_password(user.password, current_password, user.salt):
        return jsonify({"msg": "Contraseña actual incorrecta"}), 401

    user.password = set_password(new_password, user.salt)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada"}), 200


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
        return jsonify({"msg": "Faltan campos"}), 400

    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({"msg": "El correo ya está en uso"}), 409

    if not check_password(user.password, password, user.salt):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    user.email = new_email
    db.session.commit()

    return jsonify({"msg": "Correo actualizado correctamente"}), 200

@api.route('/products', methods=['GET'])
def get_products():
    query = Product.query

    category_id = request.args.get('category_id', type=int)
    if category_id is not None:
        query = query.filter_by(category_id=category_id)

    author_id = request.args.get('author_id', type=int)
    if author_id is not None:
        query = query.join(Product.authors).filter(Author.id == author_id)

    search_term = request.args.get('search', type=str)
    if search_term:
        search_term = search_term.strip().lower()
        if search_term:
            query = (
                query
                .join(Product.category)
                .join(Product.authors)
                .filter(
                db.or_(
                    func.unaccent(func.lower(Product.name)).ilike(f'%{search_term}%'),
                    func.unaccent(func.lower(Product.description)).ilike(f'%{search_term}%'),
                    func.unaccent(func.lower(Category.name)).ilike(f'%{search_term}%'),
                    func.unaccent(func.lower(Author.name)).ilike(f'%{search_term}%'),

                 )
            )
        )


    products_list=query.all()

    if not products_list:
        return jsonify({'message': 'No hay productos'}), 404
    return jsonify([product.serialize() for product in products_list]), 200


@api.route('/product/<int:id>', methods=['GET'])
def get_product(id):
    product=Product.query.get(id)
    if not product:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return jsonify(product.serialize()), 200


@api.route('/products', methods=['POST'])
def create_product():
    data=request.get_json()

    category_id = data.get('category_id')
    category=Category.query.get(data.get('category_id'))
    if not category:
        return jsonify({'error': 'Categoria no valida'}), 400

    author_ids=data.get('author_ids', [])
    authors=Author.query.filter(Author.id.in_(author_ids)).all()

    new_product=Product(
    name=data.get('name'),
    price=data.get('price'),
    image_url=data.get('image_url'),
    is_featured=data.get('is_featured', False),
    description=data.get('description', ''),
    detail_images=data.get('detail_images', []),
    rating=data.get('rating', 0),
    category_id=category_id,
    category=category,
    authors=authors,
    product_stock=data.get('product_stock', 0)
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.serialize()), 201


@api.route('/categories', methods=['GET'])
def list_categories():
    categories=Category.query.all()
    if not categories:
        return jsonify({'message': 'No hay categorías'}), 404
    return jsonify([category.serialize() for category in categories]), 200

@api.route('/categories', methods=['POST'])
def create_category():
    data=request.get_json()
    name=data.get('name')

    if not name:
        return jsonify({'error': 'Nombre de la categoria requerido'}), 400

    existing=Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'La categoria ya existe'}), 400

    category=Category(name=name)
    db.session.add(category)
    db.session.commit()

    return jsonify(category.serialize()), 201


@api.route('/authors', methods=['GET'])
def list_authors():
    authors=Author.query.all()
    if not authors:
        return jsonify({'message': 'No hay autores'}), 404
    return jsonify([author.serialize() for author in authors]), 200


@api.route('/authors', methods=['POST'])
def create_author():
    data=request.get_json()
    name=data.get('name')

    if not name:
        return jsonify({'error': 'Nombre del autor requerido'}), 400

    existing=Author.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'El autor ya existe'}), 409

    author=Author(name=name)
    db.session.add(author)
    db.session.commit()

    return jsonify(author.serialize()), 201

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
@jwt_required()
def create_checkout_session():
    user_id = get_jwt_identity()
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
                'unit_amount': int(item['price'] * 100)  
            },
            'quantity': item['quantity'],
        })

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=os.getenv("FRONTEND_URL") + '/success',
            cancel_url=os.getenv("FRONTEND_URL") + '/cancel',
            metadata={'user_id': user_id}
        )
        return jsonify({'url': session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@api.route('/contact-form', methods=["POST"])
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
    
    #Webhook de Stripe
    from flask import abort

@api.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        return jsonify({'msg': 'Webhook signature verification failed'}), 400
    except Exception as e:
        return jsonify({'msg': f'Webhook error: {str(e)}'}), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('metadata', {}).get('user_id')

        if not user_id:
            return jsonify({'msg': 'User ID no encontrado en metadata'}), 400

        # Recuperar los items de la sesión
        line_items = stripe.checkout.Session.list_line_items(session['id'])
        total_amount = session['amount_total'] / 100  # en dólares

        # Crear la orden
        new_order = Order(user_id=user_id, total=total_amount)
        db.session.add(new_order)
        db.session.commit()

        for item in line_items['data']:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item['price']['product'],  # requiere validación
                product_name=item['description'],
                product_description="",
                quantity=item['quantity'],
                price=item['amount_total'] / 100
            )
            db.session.add(order_item)

        db.session.commit()
        print("Orden creada desde webhook Stripe ✅")

        # endpoint para popular la base de datos
@api.route("/populate-user", methods=["GET"])
def populate_users():
    for rol in roles:
        role = Role(role_name=rol)
        db.session.add(role)
    for person in users:
        user = User(
            email=person.get("email"),
            name=person.get("name"),
            role_id=person.get("role_id"),
            password=generate_password_hash(person.get("password")),
            salt=b64encode(os.urandom(32)).decode("utf-8")
        )
        db.session.add(user)
    for cat in categories:
        category = Category(name=cat.get("name"))
        db.session.add(category)
    for author in authors:
        new_author = Author(name=author.get("name"))
        db.session.add(new_author)
    for product in products:
        new_product = Product(
            name=product.get("name"),
            price=product.get("price"),
            image_url=product.get("image_url"),
            is_featured=product.get("is_featured", False),
            description=product.get("description", ''),
            detail_images=product.get("detail_images", []),
            rating=product.get("rating", 0),
            product_stock=product.get("product_stock", 0),
            category_id=product.get("category_id"),
        )
        db.session.add(new_product)
        for author_id in product.get("author_ids", []):
            author = Author.query.get(author_id)
            if author:
                new_product.authors.append(author)
    db.session.flush()
    # Commit all changes to the database
    try:
        db.session.commit()
        return jsonify("Populate success"), 201
    except Exception as error:
        db.session.rollback()
        return jsonify(f"Error: {error.args}"), 500









