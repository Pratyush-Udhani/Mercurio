from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from uuid import UUID, uuid4

from sqlmodel import Session

from app.models.workflow import Workflow
from app.services.scraper import scrape_amazon
from app.core.logger import logger

from app.models.product import ProductInfo
from app.db.session import get_session
from app.db.models import WorkflowTable

router = APIRouter(
    prefix="/scrape",
    tags=["scrape"],
)

class ScrapeRequest(BaseModel):
    url: str

class ScrapeResponse(BaseModel):
    uuid: UUID

@router.post("", response_model=ScrapeResponse)
async def scrape_endpoint(
    request: ScrapeRequest,
    db: Session = Depends(get_session)
):
    """
    Accepts { url: "https://www.amazon.com/..." }
    Creates a new Workflow and adds it to the database.
    Returns uuid of the created Workflow
    """
    try:
        logger.info(f"scraping {request.url[:50]}")

        product = await scrape_amazon(request.url)
        uuid = uuid4()
        workflow = Workflow(uuid=uuid, product=product)

        # persist to DB
        db_obj = WorkflowTable(
            uuid=workflow.uuid,
            product_name=workflow.product.product_name,
            product_description=workflow.product.product_description,
            images=workflow.product.images,
        )
        db.add(db_obj)
        db.commit()

        logger.info(f"Creating a new workflow {uuid}")
        return ScrapeResponse(uuid=uuid)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"Scraping failed: {e}")

