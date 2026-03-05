from flask import Blueprint, request, jsonify
import gspread
from google.oauth2.service_account import Credentials
from app.services.sql_service import SQLService

def create_gg_sheet_blueprint(sql_service: SQLService):
    file_bp = Blueprint('gg_sheets', __name__, url_prefix='/services/spread-sheets/gg_sheets')

    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
    ]
    creds = Credentials.from_service_account_file('credentials.json', scopes=scopes)
    client = gspread.authorize(creds)
    
    @file_bp.route('/fetch', methods=['POST'])
    def fetch_gg_sheet():
        req = request.json
        print("Request: ", req)
        saved_id, title, type, message = sql_service.save_gg_sheet_by_url(req['url'], client, req['chatId'])
        
        response = {
            "saved_id": saved_id,
            "name": title,
            "type": type,
            "message": message,
        } if saved_id else {"message": message}
        print(response)
        
        return jsonify(response)
        
    return file_bp
