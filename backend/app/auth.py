import os
from fastapi import Request, HTTPException
from fastapi import status
from clerk_backend_api import Clerk
from clerk_backend_api.security import authenticate_request
from clerk_backend_api.security.types import AuthenticateRequestOptions
from dotenv import load_dotenv

load_dotenv()

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

async def verify_clerk_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="unAuthorized")

    try:
        request_state = clerk.authenticate_request(
            request,
            options=AuthenticateRequestOptions()
        )
        if not request_state.is_signed_in:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Authentication required"
            )
    except:
        raise HTTPException(status_code=401, detail="Invalid token format")

    try:
        claims = request_state.payload
        userEmail = claims.get("email")
        userId = claims.get("sub")
        fname = claims.get("first_name", "")
        lname = claims.get("last_name", "")
        return {
            "userEmail": userEmail,
            "userId": userId,
            "firstName": fname,
            "lastName": lname
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
