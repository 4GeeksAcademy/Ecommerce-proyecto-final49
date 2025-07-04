from flask import jsonify, url_for
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import ssl
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta


class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["message"] = self.message
        return rv


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def generate_sitemap(app):
    links = ["/admin/"]
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return (
        """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""
        + links_html
        + "</ul></div>"
    )


def send_email(subject, to, body):
    smtp_address = os.getenv("SMTP_ADDRESS")
    smtp_port = int(os.getenv("SMTP_PORT"))
    email_address = os.getenv("EMAIL_ADDRESS")
    email_password = os.getenv("EMAIL_PASSWORD")

    message = MIMEMultipart("alternative")
    message["subject"] = subject
    message["From"] = "blacklottus.programacion@gmail.com"
    message["to"] = to

    html = f"""<html> 
        <body>
            {body}
        </body>
    </html>"""

    html_mime = MIMEText(html, "html")
    message.attach(html_mime)

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_address, smtp_port, context=context) as server:
            server.login(email_address, email_password)
            server.sendmail(email_address, to, message.as_string())
            return True
    except Exception as error:
        print(str(error))
        return False


def population_data():
    User.populate()

# FUNCIONES DE CONTRASEÑA

def set_password(password, salt):
    if len(password) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres.")
    return generate_password_hash(f'{password}{salt}')


def check_password(pass_hash, password, salt):
    return check_password_hash(pass_hash, f'{password}{salt}')


# VALIDACIÓN DE CORREO
def validate_email(user_email, user_id):
    try:
        token = create_access_token(
            identity=str(user_id),
            expires_delta=timedelta(hours=1)
        )

        reset_url = f'{os.getenv("FRONTEND_URL")}/recuperar-contraseña?token={token}'
        message = f"""
            <div>
                <h1>Verifica tu correo</h1>
                <p>Por favor entra al siguiente enlace para restablecer tu contraseña:</p>
                <a href="{reset_url}" target="_blank">Restablecer Contraseña</a>
                <p>Si no solicitaste esto, por favor ignora este correo.</p>
            </div>
        """

        sended_email = send_email("Recuperación de contraseña", user_email, message)

        if sended_email:
            return jsonify({"msg": "Si tu correo está en nuestro sistema, recibirás un enlace para recuperar la contraseña."}), 200
        else:
            return jsonify({"msg": "Error interno al enviar el correo."}), 500

    except Exception as e:
        return jsonify({"msg": "Error inesperado", "error": str(e)}), 500
