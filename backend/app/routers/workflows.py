from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.db.models import WorkflowTable
from app.models.workflow import Workflow
from app.models.product import ProductInfo

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

    return Workflow(uuid=db_obj.uuid, product=product)



@router.post("/{workflow_id}/generate-scripts", response_model=Workflow)
async def generate_scripts_endpoint(
    workflow: Workflow,
    session: Session = Depends(get_session),
):
    """
    POST /workflows/{id}/generate-scripts
    Body: { uuid, product: { … } }
    Returns: Workflow with a list of LLM scripts
    """

    db_obj = session.get(WorkflowTable, workflow.uuid)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workflow not found")
    try:
        result = await generate_scripts(workflow)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Script generation failed: {e}"
        )

