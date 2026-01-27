from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Schema for returning the access token upon successful login."""
    access_token: str
    token_type: str = "bearer" # Standard for JWT tokens

class TokenData(BaseModel):
    """Schema for data stored inside the JWT payload (used internally by security)."""
    user_id: Optional[int] = None
    role: Optional[str] = None
