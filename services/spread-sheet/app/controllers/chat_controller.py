from flask import Blueprint, request, jsonify
from app.services.agentic_service import AgenticService
import os


def create_chat_blueprint(sql_service, file_service):
    chat_bp = Blueprint('chats', __name__, url_prefix='/services/spread-sheets/chats')
    
    agentic_service = AgenticService(sql_service, file_service)
    
    @chat_bp.route('/conversation', methods=['POST'])
    def handle_conversation():
        req = request.get_json()
        
        result = agentic_service.run(req['chatId'], req['question'], req['history'], req['source'])

        remove_img_path = result.get('remove_img_path')

        if remove_img_path:
            if os.path.exists(remove_img_path):
                os.remove(remove_img_path)
                print(f"{remove_img_path} has been removed.")
            else:
                print(f"{remove_img_path} does not exist.")
        else:
            print("No image path provided to remove.")
            
        res = {
            "answer": result['answer'],
            "image": result['image'],
            "script": result['script']
        }

        return jsonify(res)
    
    return chat_bp

