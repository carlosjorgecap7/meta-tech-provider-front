import os

def lambda_handler(event, context):
    params = event.get("queryStringParameters") or {}
    
    mode      = params.get("hub.mode")
    token     = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    
    verify_token = os.environ["VERIFY_TOKEN"]
    
    if mode == "subscribe" and token == verify_token:
        return {
            "statusCode": 200,
            "body": challenge,
            "headers": {"Content-Type": "text/plain"}
        }
    
    return {
        "statusCode": 403,
        "body": "Forbidden"
    }