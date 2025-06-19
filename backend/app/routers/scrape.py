from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.product import ProductInfo
from app.services.scraper import scrape_amazon
from app.core.logger import logger

router = APIRouter(
    prefix="/scrape",
    tags=["scrape"],
)

class ScrapeRequest(BaseModel):
    url: str

@router.post("", response_model=ProductInfo)
async def scrape_endpoint(request: ScrapeRequest):
    """
    Accepts { url: "https://www.amazon.com/..." }
    Returns ProductInfo JSON.
    """
    try:
        logger.info(f"scraping {request.url}")
        return await scrape_amazon(request.url)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"Scraping failed: {e}")

