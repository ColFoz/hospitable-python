#!/usr/bin/env python3
"""
Parse the JWT token from the docs to see if it's valid/expired.
"""

from hospitable import parse_jwt
from datetime import datetime

# Token from the docs example
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YTYyNGRmMC0xMmYxLTQ0OGUtYjg4NC00MzY3ODBhNWQzY2QiLCJqdGkiOiI4M2JmYjBhZmE2NmU3NTg5YmM4YjcxYWM0OGU2MGVjMjg4ODRiMTRiNTFiNTNjYWMwMzJiM2Q3ZTJmNWQ4NGM4MGYwNjQxOWIzYjhiZjQ1MiIsImlhdCI6MTc1NTI3MDA0OS4wODEwOTcsIm5iZiI6MTc1NTI3MDA0OS4wODExLCJleHAiOjE3ODY4MDYwNDkuMDc3MTksInN1YiI6IjMzMjc0Iiwic2NvcGVzIjpbInBhdDpyZWFkIiwicGF0OndyaXRlIl19.jniQvWFhwTFXKdVbztn9QkcNvxFHEj6rh7SfuAV1N4ro2lfqp4nBhU9xDODYboEqe2CFwu8VMDx4J5qpecd3CJVa2Gn6oHjjNTtAKc9LLXeTXAzVwQ6cb6TqfyZbXkQYs6T2sOJ1pFxO7BpA2KHodaZmT68x2WYacEQ5VvG2KzOhG6u3gU-ctEK28u_yfq0-exODuK7JcNX8uk37tEvSDb6D9xlV70AP7GgjLA-bBhKT4hxMPcvm069GhpwY8imS-SxLds9fDMafT0lQP1OyAvzM6mjrlJUzPenc3Cn7ic5mEHV_OvokivnUE5Ea4jMatyTVQb8EFV82ly06XsIfso3ydHdd2X9PfyBawdDHDBDNK-fi9vGeXlATXff14aJkyHScjUddqkVP6tiuc_hKGJvcJywGmLXmNMOs8-D7LUoqzQgX-JB1UQqn8jtLoFgDki3SYiQ2QpZMjaDlzVVqGhxues0lbxVNJ4OwoiFTra6WWJSkbKwUSYyCmickYSBhrE6jPZum-FXWiAOm9v1OpRJ8xSEho3hn5w1Mup7BkBcHjoQRjZnjjTMQSlTO9GUXQnujXSbJD2_bYc9JsajDy9uI5qWM6LntNeuefhLAyWKLWR39oKhoJBEGT40pdGxOa_kvwP7vRvsDqUGa5gcSpHZhaV6gpApcER53KsRz2Uc"

print("Token from API Documentation:")
print("=" * 60)

jwt_info = parse_jwt(token)

print(f"User ID: {jwt_info.user_id}")
print(f"Scopes: {', '.join(jwt_info.scopes)}")
print(f"Issued At: {jwt_info.issued_at}")
print(f"Expires At: {jwt_info.expires_at}")
print(f"Is Expired: {jwt_info.is_expired}")
print(f"Has Read Access: {jwt_info.has_read_access()}")
print(f"Has Write Access: {jwt_info.has_write_access()}")

# Compare dates
print()
print(f"Current Time: {datetime.now()}")
print(f"Token Issued: {jwt_info.issued_at}")
print(f"Token Expires: {jwt_info.expires_at}")

if jwt_info.is_expired:
    print("\n⚠️ TOKEN IS EXPIRED!")
else:
    print("\n✓ Token is still valid")
