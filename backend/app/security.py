import re
from html import escape
from fastapi import Request, HTTPException, status

def sanitize_text(text: str) -> str:
    if not text:
        return ""
    clean = re.sub(r'<[^>]*>', '', text)
    return escape(clean.strip())

async def limit_request_size(request: Request, max_bytes: int = 500 * 1024):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Request payload exceeds maximum allowed size of {max_bytes // 1024} KB."
        )
