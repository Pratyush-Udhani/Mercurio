from pydantic import BaseModel, HttpUrl
from typing import List

class ProductInfo(BaseModel):
    product_name: str
    product_description: str
    images: List[HttpUrl]

