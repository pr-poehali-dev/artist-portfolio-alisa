'''
Business: API для загрузки изображений в base64 формате
Args: event - dict с httpMethod, body (base64 изображение)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с URL загруженного изображения
'''

import json
import base64
import os
import uuid
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        image_base64 = body_data.get('image')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Image data required'})
            }
        
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        
        file_id = str(uuid.uuid4())
        file_ext = 'jpg'
        
        if image_base64.startswith('iVBOR'):
            file_ext = 'png'
        elif image_base64.startswith('/9j/'):
            file_ext = 'jpg'
        elif image_base64.startswith('R0lG'):
            file_ext = 'gif'
        
        filename = f"{file_id}.{file_ext}"
        
        upload_dir = '/tmp/uploads'
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, filename)
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        image_url = f"/uploads/{filename}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'url': image_url,
                'filename': filename
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
