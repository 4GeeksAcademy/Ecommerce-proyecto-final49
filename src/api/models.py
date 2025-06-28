from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, Integer , Text, JSON, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime


db = SQLAlchemy()
# necesita de conexion con la base de datos antes de ser implementado
# class Role(db.Model):
#     __tablename__ = 'role'
#     id: Mapped[int] = mapped_column(primary_key=True)
#     name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
#     users: Mapped[list['User']] = relationship(back_populates='role')

#     def __repr__(self):
#         return f'<Role {self.name}>'

book_authors = Table(
    'book_authors', 
    db.metadata,
    db.Column('product_id', Integer, db.ForeignKey('product.id'), primary_key=True),
    db.Column('author_id', Integer, db.ForeignKey('author.id'), primary_key=True),
)

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

class Category(db.Model):
    __tablename__ ='category'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)

    products: Mapped[list['Product']] = relationship(back_populates='category')

    def serialize(self):
        return{'id': self.id, 'name': self.name}
    
class Author(db.Model):
    __tablename__ = 'author'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    products: Mapped[list['Product']] = relationship('Product', secondary=book_authors, back_populates='authors')

    def serialize(self):
        return {'id': self.id, 'name': self.name}


class Product(db.Model):
    __tablename__='product'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    detail_images: Mapped[list] = mapped_column(JSON, nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=True)
    category_id: Mapped[int] = mapped_column(ForeignKey('category.id'), nullable=False)
    category: Mapped[Category] = relationship(back_populates='products')
    authors: Mapped[list[Author]] = relationship('Author', secondary=book_authors, back_populates='products')
    

    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'price': self.price,

            'image_url': self.image_url,            #foto principal
            'is_featured': self.is_featured,
            'description': self.description,
            'detail_images': self.detail_images,    #fotos miniatura
            'rating': self.rating,
            'category': self.category,
            'authors': [a.serialize() for a in self.authors],
        }