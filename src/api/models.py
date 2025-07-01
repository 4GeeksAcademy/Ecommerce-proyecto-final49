from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates
from datetime import datetime
# from .users import 

db = SQLAlchemy()
# necesita de conexion con la base de datos antes de ser implementado
# class Role(db.Model):
#     __tablename__ = 'role'
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
#     users: Mapped[list['User']] = relationship(back_populates='role')

#     def __repr__(self):
#         return f'<Role {self.name}>'

class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False) 
    password: Mapped[str] = mapped_column(String(255), nullable=False)   
    salt: Mapped[str] = mapped_column(String(80), nullable=False, default="")   
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    # rompe el codigo si no existe la base de datos
    # role_id: Mapped[int] = mapped_column(ForeignKey('role.id'), nullable=False)
    
    # role: Mapped['Role'] = relationship(back_populates='users')
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role.name if self.role else 2
        }
    
    def populate(self):
        pass


class Product(db.Model):
    __tablename__ = 'product'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    detail_images: Mapped[list] = mapped_column(JSON, nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=True)
    # category: Mapped[str] = mapped_column(String(80), nullable=False, default='General')

    @validates('rating')
    def validate_rating(self, key, value):
        if value < 0 or value > 5:
            raise ValueError("El rating debe estar entre 0 y 5")
        return value

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'image_url': self.image_url,  # foto principal
            'is_featured': self.is_featured,
            'description': self.description,
            'detail_images': self.detail_images,    #fotos miniatura
            'rating': self.rating
        }
    # CARRITO DE COMPRAS 
class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    user = db.relationship('User', backref='cart_items')
    product = db.relationship('Product', backref='cart_items')

class ContactMessage(db.Model):
    __tablename__ = 'contact_message'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False) 
    message: Mapped[str] = mapped_column(String(1000), nullable=False)

# ORDEN DE COMPRA 
class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship("OrderItem", backref="order", lazy=True)
    def serialize(self):
        return {
        "id": self.id,
        "user_id": self.user_id,
        "total": self.total,
        "created_at": self.created_at.isoformat(),
        "items": [item.serialize() for item in self.items]
    }
class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    product_name = db.Column(db.String(120), nullable=False)
    product_description = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
