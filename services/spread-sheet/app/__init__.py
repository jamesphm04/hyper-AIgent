# from flask import Flask
# from app.extensions import db
# from app.api.routes import api_bp
# from app.config import Config   

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)
#     db.init_app(app)
    
#     app.register_blueprint(api_bp)
    
#     return app