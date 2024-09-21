from flask import jsonify
from . import redis_client, db  # Use relative imports

@app.route('/', methods=['GET'])
def main():
    # Using Redis
    redis_client.set('key', 'Hello from Redis!')
    redis_value = redis_client.get('key').decode('utf-8')

    print(redis_value)  # This will log the Redis value to the console
    # Example response
    return jsonify({
        'message': 'Hello from Flask!',
        'redis_message': redis_value
    })
