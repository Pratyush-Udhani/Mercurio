from pydantic import BaseModel, HttpUrl
from typing import List

class ProductInfo(BaseModel):
    """
    Prduct Info scraped from amazon
    - product_name
    - product_description: taken from About the Product section
    - images: list of main and alt images of the product
    """
    product_name: str
    product_description: str
    images: List[str]

