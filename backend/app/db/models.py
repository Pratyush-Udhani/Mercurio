from uuid import UUID
from typing import List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

class WorkflowTable(SQLModel, table=True):
    uuid: UUID = Field(primary_key=True)
    product_name: str
    product_description: str
    
    # store images as JSON array
    images: List[str] = Field(
        sa_column=Column(JSON), 
        default_factory=list
    )

