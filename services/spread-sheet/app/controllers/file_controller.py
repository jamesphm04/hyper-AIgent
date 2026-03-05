from flask import Blueprint, jsonify
from app.services.file_service import FileService
from app.services.sql_service import SQLService

def create_file_blueprint(sql_service: SQLService, file_service: FileService):
    file_bp = Blueprint('files', __name__, url_prefix='/services/spread-sheets/files')

    @file_bp.route('/preprocess/<int:file_id>', methods=['GET'])
    def preprocess_file(file_id):
        file_content, _, _ = sql_service.get_file(file_id, "files")
        
        dfs = file_service.read_excel_file(file_content, all_sheets=True)
        cleaned_dfs = file_service.clean_xlsx(dfs)
        cleaned_content_bytes = file_service.extract_file_content_bytes(cleaned_dfs)
        sql_service.save_excel_file(file_id, cleaned_content_bytes)
        return jsonify({"message": "File preprocessed successfully."})
        
    return file_bp
