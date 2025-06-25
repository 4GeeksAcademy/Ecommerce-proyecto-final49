from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False) 
    password: Mapped[str] = mapped_column(String(255), nullable=False)  
    salt: Mapped[str] = mapped_column(String(80), nullable=False, default="")  
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }

    
class Product(db.Model):
    __tablename__='product' 

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False)
    
    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'image_url': self.image_url,
            'is_featured': self.is_featured
        }