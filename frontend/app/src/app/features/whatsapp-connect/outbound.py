import json
import os
import urllib.request
import urllib.parse
import urllib.error

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return _response(400, {"error": "Invalid JSON body"})
    
    code    = body.get("code")
    waba_id = body.get("wabaId")
    
    if not code or not waba_id:
        return _response(400, {"error": "Missing code or wabaId"})
    
    app_id     = os.environ["META_APP_ID"]
    app_secret = os.environ["META_APP_SECRET"]
    
    params = urllib.parse.urlencode({
        "client_id":     app_id,
        "client_secret": app_secret,
        "code":          code
    })
    
    url = f"https://graph.facebook.com/v21.0/oauth/access_token?{params}"
    
    try:
        with urllib.request.urlopen(url, timeout=8) as response:
            token_data = json.loads(response.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"Meta token exchange error: {error_body}")
        return _response(502, {"error": "Token exchange failed"})
    except Exception as e:
        print(f"Unexpected error: {e}")
        return _response(500, {"error": "Internal error"})
    
    access_token = token_data.get("access_token")
    
    print(f"WABA onboarded: {waba_id}")
    print(f"Token received (length): {len(access_token) if access_token else 0}")
    
    return _response(200, {
        "status": "ok",
        "wabaId": waba_id
    })


def _response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body)
    }