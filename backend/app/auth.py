import os
from fastapi import Request, HTTPException
from clerk_backend_api import Clerk
from dotenv import load_dotenv

# load .env file
load_dotenv()

SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

if not SECRET_KEY:
    raise Exception("CLERK_SECRET_KEY not found in environment variables")

clerk = Clerk(SECRET_KEY)
# not api_key=SECRET_KEY — constructor expects only the key

async def verify_clerk_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise Exception("Invalid scheme")
    except:
        raise HTTPException(status_code=401, detail="Invalid token format")

    try:
        session = clerk.sessions.verify(token)
        return session
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
