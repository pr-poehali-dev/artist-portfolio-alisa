'''
Business: API для управления проектами и их фотографиями
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с проектами или результатом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any, List, Optional

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            project_id = query_params.get('project_id')
            
            if project_id:
                cur.execute('''
                    SELECT p.id, p.title, p.description, p.cover_image_url,
                           COALESCE(
                               json_agg(
                                   json_build_object('id', pi.id, 'url', pi.image_url, 'position', pi.position)
                                   ORDER BY pi.position
                               ) FILTER (WHERE pi.id IS NOT NULL),
                               '[]'::json
                           ) as images
                    FROM projects p
                    LEFT JOIN project_images pi ON p.id = pi.project_id
                    WHERE p.id = %s
                    GROUP BY p.id
                ''', (project_id,))
                
                row = cur.fetchone()
                if row:
                    project = {
                        'id': row[0],
                        'title': row[1],
                        'description': row[2],
                        'coverImage': row[3],
                        'images': row[4]
                    }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(project, ensure_ascii=False)
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Project not found'})
                    }
            else:
                search = query_params.get('search', '').lower()
                
                if search:
                    cur.execute('''
                        SELECT p.id, p.title, p.description, p.cover_image_url,
                               COALESCE(
                                   json_agg(
                                       json_build_object('id', pi.id, 'url', pi.image_url, 'position', pi.position)
                                       ORDER BY pi.position
                                   ) FILTER (WHERE pi.id IS NOT NULL),
                                   '[]'::json
                               ) as images
                        FROM projects p
                        LEFT JOIN project_images pi ON p.id = pi.project_id
                        WHERE LOWER(p.title) LIKE %s
                        GROUP BY p.id
                        ORDER BY p.id
                    ''', (f'%{search}%',))
                else:
                    cur.execute('''
                        SELECT p.id, p.title, p.description, p.cover_image_url,
                               COALESCE(
                                   json_agg(
                                       json_build_object('id', pi.id, 'url', pi.image_url, 'position', pi.position)
                                       ORDER BY pi.position
                                   ) FILTER (WHERE pi.id IS NOT NULL),
                                   '[]'::json
                               ) as images
                        FROM projects p
                        LEFT JOIN project_images pi ON p.id = pi.project_id
                        GROUP BY p.id
                        ORDER BY p.id
                    ''')
                
                rows = cur.fetchall()
                projects = []
                for row in rows:
                    projects.append({
                        'id': str(row[0]),
                        'title': row[1],
                        'description': row[2],
                        'coverImage': row[3],
                        'images': row[4]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(projects, ensure_ascii=False)
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            project_id = body_data.get('project_id')
            image_url = body_data.get('image_url')
            image_type = body_data.get('type', 'gallery')
            position = body_data.get('position', 0)
            
            if not project_id or not image_url:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'project_id and image_url are required'})
                }
            
            if image_type == 'cover':
                cur.execute('''
                    UPDATE projects 
                    SET cover_image_url = %s, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = %s
                    RETURNING id, title, cover_image_url
                ''', (image_url, project_id))
                
                row = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'project_id': row[0],
                        'title': row[1],
                        'cover_image_url': row[2]
                    }, ensure_ascii=False)
                }
            else:
                cur.execute('''
                    INSERT INTO project_images (project_id, image_url, position)
                    VALUES (%s, %s, %s)
                    RETURNING id, image_url, position
                ''', (project_id, image_url, position))
                
                row = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'image_id': row[0],
                        'image_url': row[1],
                        'position': row[2]
                    }, ensure_ascii=False)
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
