from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.db.session import get_session
from app.db.models import WorkflowTable
from app.models import product
from app.models.workflow import Workflow
from app.models.product import ProductInfo
from app.core.logger import logger

from app.services.llm_script import generate_scripts


router = APIRouter(
    prefix="/workflows",
    tags=["workflows"],
)

@router.get("/{workflow_id}", response_model=Workflow)
def read_workflow(
    workflow_id: UUID,
    session: Session = Depends(get_session),
):
    """
    Fetch a workflow by UUID from the database and return
    the nested Workflow Pydantic model.
    """
    db_obj = session.get(WorkflowTable, workflow_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Rehydrate the nested ProductInfo
    product = ProductInfo(
        product_name=db_obj.product_name,
        product_description=db_obj.product_description,
        images=db_obj.images,
    )

    return Workflow(uuid=db_obj.uuid, product=product, llm_scripts=db_obj.llm_scripts)

@router.put("/{workflow_id}/update", status_code=status.HTTP_200_OK)
def update_workflow(
    workflow_id: UUID,
    workflow: Workflow,
    db: Session = Depends(get_session),
):
    """
    Takes in workflow as body and updates
    """
    db_obj = db.get(WorkflowTable, workflow_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Update each field you allow changed
    db_obj.product_name        = workflow.product.product_name
    db_obj.product_description = workflow.product.product_description
    db_obj.images              = workflow.product.images
    db.commit()
    db.refresh(db_obj)

    return {"detail": "OK"}


@router.post("/{workflow_id}/generate-scripts", response_model=Workflow)
async def generate_scripts_endpoint(
    workflow_id: UUID,
    workflow: Workflow,
    db: Session = Depends(get_session),
):
    """
    POST /workflows/{id}/generate-scripts
    Body: { uuid, product: { … } }
    Returns: status_code
    """

    db_obj = db.get(WorkflowTable, workflow.uuid)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workflow not found")

    try:
        result = await generate_scripts(workflow)
        db_obj.product_name = workflow.product.product_name
        db_obj.product_description = workflow.product.product_description
        db_obj.llm_scripts = result
        db.commit()
        db.refresh(db_obj)

        return Workflow(
            uuid=db_obj.uuid,
            product=workflow.product,
            llm_scripts=result,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Script generation failed: {e}"
        )

