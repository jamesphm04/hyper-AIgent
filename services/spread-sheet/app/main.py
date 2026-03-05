from flask import Flask
from app.extensions import db
from app.controllers.chat_controller import create_chat_blueprint
from app.controllers.file_controller import create_file_blueprint
from app.controllers.gg_sheet_controller import create_gg_sheet_blueprint
from app.services.file_service import FileService
from app.services.sql_service import SQLService
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    
    # Initialize shared services
    sql_service = SQLService()
    file_service = FileService()

    # Pass these shared services to the controllers
    app.register_blueprint(create_chat_blueprint(sql_service, file_service))
    app.register_blueprint(create_file_blueprint(sql_service, file_service))
    app.register_blueprint(create_gg_sheet_blueprint(sql_service))

    return app