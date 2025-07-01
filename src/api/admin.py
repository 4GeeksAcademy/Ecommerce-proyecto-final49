import os
from flask_admin import Admin
from .models import db, User, Product
from flask_admin.contrib.sqla import ModelView
from wtforms import TextAreaField
from flask_admin.form import rules


class ProductAdmin(ModelView):
    form_overrides = {
        'detail_images': TextAreaField,  
        'description': TextAreaField    
    }
    form_excluded_columns = ['rating']  
    column_list = ['id', 'name', 'price', 'is_featured']  

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ProductAdmin(Product, db.session))  

