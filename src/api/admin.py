  
import os
from flask_admin import Admin
from .models import db, User, Product, Category, Author
from .models import db, User, Product, ContactMessage, Role
from flask_admin.contrib.sqla import ModelView


# class ProductAdmin(ModelView):
#         form_columns = [
#             'name',
#             'price',
#             'image_url',
#             'is_featured',
#             'description',
#             'detail_images',
#             'rating',
#             'category',
#             'authors',
#         ]

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    
    admin.add_view(ModelView(Author,db.session))
    admin.add_view(ModelView(Category,db.session))

    # admin.add_view(ProductAdmin(Product, db.session))
    admin.add_view(ModelView(Product, db.session))
    admin.add_view(ModelView(ContactMessage, db.session))
    admin.add_view(ModelView(Role, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))

   