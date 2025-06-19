from typing import Dict, Optional
from pydantic import BaseModel
from uuid import UUID
from app.models.product import ProductInfo

class Workflow(BaseModel):
    """
    A workflow session:
    - uuid: unique identifier for this scrape session
    - product: the scraped product info
    - llm_scripts: List of different LLM scripts
    """    
    uuid: UUID
    product: ProductInfo
    llm_scripts: Optional[Dict[str, str]] = None

