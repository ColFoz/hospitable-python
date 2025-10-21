from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import sys

# Add parent directory to path to import hospitable module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from hospitable import HospitableClient
from hospitable.exceptions import (
    AuthenticationError,
    RateLimitError,
    ValidationError,
    NotFoundError,
    ForbiddenError
)

app = FastAPI(title="Hospitable Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_client(authorization: Optional[str] = None) -> HospitableClient:
    """Create Hospitable client from Authorization header or environment variable"""
    token = None
    
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    elif os.getenv("HOSPITABLE_PAT"):
        token = os.getenv("HOSPITABLE_PAT")
    elif os.getenv("HOSPITABLE_TOKEN"):
        token = os.getenv("HOSPITABLE_TOKEN")
    
    if not token:
        raise HTTPException(status_code=401, detail="No authentication token provided")
    
    try:
        return HospitableClient(token=token)
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/")
def read_root():
    return {
        "name": "Hospitable Dashboard API",
        "version": "1.0.0",
        "endpoints": {
            "properties": "/properties",
            "reservations": "/reservations",
            "messages": "/messages/{reservation_uuid}",
            "reviews": "/reviews/{property_uuid}",
            "user": "/user"
        }
    }


@app.get("/user")
def get_user(authorization: Optional[str] = Header(None)):
    """Get authenticated user information"""
    client = get_client(authorization)
    try:
        user = client.user.get()
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/token-info")
def get_token_info(authorization: Optional[str] = Header(None)):
    """Get JWT token information"""
    client = get_client(authorization)
    try:
        token_info = client.get_token_info()
        if not token_info:
            return {"message": "Token info not available (not a JWT token)"}
        
        return {
            "user_id": token_info.user_id,
            "expires_at": token_info.expires_at.isoformat() if token_info.expires_at else None,
            "is_expired": token_info.is_expired,
            "scopes": token_info.scopes,
            "has_read_access": token_info.has_read_access(),
            "has_write_access": token_info.has_write_access(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/properties")
def list_properties(
    authorization: Optional[str] = Header(None),
    include: Optional[str] = None,
    page: int = 1,
    per_page: int = 50
):
    """List all properties"""
    client = get_client(authorization)
    try:
        properties = client.properties.list(include=include, page=page, per_page=per_page)
        return properties
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/properties/{property_uuid}")
def get_property(
    property_uuid: str,
    authorization: Optional[str] = Header(None),
    include: Optional[str] = None
):
    """Get a specific property"""
    client = get_client(authorization)
    try:
        property_data = client.properties.get(property_uuid, include=include)
        return property_data
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/properties/{property_uuid}/calendar")
def get_calendar(
    property_uuid: str,
    start_date: str,
    end_date: str,
    authorization: Optional[str] = Header(None)
):
    """Get property calendar"""
    client = get_client(authorization)
    try:
        calendar = client.properties.get_calendar(property_uuid, start_date, end_date)
        return calendar
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReservationQuery(BaseModel):
    properties: Optional[List[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    include: Optional[str] = None
    page: int = 1
    per_page: int = 50


@app.post("/reservations/query")
def query_reservations(
    query: ReservationQuery,
    authorization: Optional[str] = Header(None)
):
    """Query reservations with filters"""
    client = get_client(authorization)
    try:
        reservations = client.reservations.list(
            properties=query.properties,
            start_date=query.start_date,
            end_date=query.end_date,
            include=query.include,
            page=query.page,
            per_page=query.per_page
        )
        return reservations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/reservations/{reservation_uuid}")
def get_reservation(
    reservation_uuid: str,
    authorization: Optional[str] = Header(None),
    include: Optional[str] = None
):
    """Get a specific reservation"""
    client = get_client(authorization)
    try:
        reservation = client.reservations.get(reservation_uuid, include=include)
        return reservation
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/messages/{reservation_uuid}")
def get_messages(
    reservation_uuid: str,
    authorization: Optional[str] = Header(None)
):
    """Get messages for a reservation"""
    client = get_client(authorization)
    try:
        messages = client.messages.list(reservation_uuid)
        return messages
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class MessageCreate(BaseModel):
    body: str
    images: Optional[List[str]] = None


@app.post("/messages/{reservation_uuid}")
def send_message(
    reservation_uuid: str,
    message: MessageCreate,
    authorization: Optional[str] = Header(None)
):
    """Send a message to a guest"""
    client = get_client(authorization)
    try:
        response = client.messages.send(
            reservation_uuid,
            message.body,
            images=message.images
        )
        return response
    except RateLimitError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/reviews/{property_uuid}")
def get_reviews(
    property_uuid: str,
    authorization: Optional[str] = Header(None),
    include: Optional[str] = None
):
    """Get reviews for a property"""
    client = get_client(authorization)
    try:
        reviews = client.reviews.list(property_uuid, include=include)
        return reviews
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReviewResponse(BaseModel):
    response: str


@app.post("/reviews/{review_uuid}/respond")
def respond_to_review(
    review_uuid: str,
    review_response: ReviewResponse,
    authorization: Optional[str] = Header(None)
):
    """Respond to a review"""
    client = get_client(authorization)
    try:
        response = client.reviews.respond(review_uuid, review_response.response)
        return response
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
