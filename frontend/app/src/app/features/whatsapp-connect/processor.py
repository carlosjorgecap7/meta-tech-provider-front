import hmac
import hashlib
import json
import os

def lambda_handler(event, context):
    headers = event.get("headers") or {}
    
    signature = (
        headers.get("x-hub-signature-256")
        or headers.get("X-Hub-Signature-256", "")
    )
    
    body       = event.get("body") or ""
    app_secret = os.environ["APP_SECRET"]
    
    expected = "sha256=" + hmac.new(
        app_secret.encode("utf-8"),
        body.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected):
        print(f"Invalid signature. Expected: {expected}, received: {signature}")
        return {"statusCode": 403, "body": "Invalid signature"}
    
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        print(f"Body is not valid JSON: {body}")
        return {"statusCode": 400, "body": "Invalid JSON"}
    
    print(f"Webhook received: {json.dumps(payload, indent=2)}")
    
    return {"statusCode": 200, "body": "OK"}