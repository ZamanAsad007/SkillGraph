from pydantic import BaseModel
from fastapi import APIRouter

from app.pipeline.extractor import extract_skills

router = APIRouter()


class ExtractRequest(BaseModel):
    student_id: str
    repositories: list[dict]


@router.post("/nlp/extract")
def extract(payload: ExtractRequest) -> dict:
    extracted = extract_skills(payload.student_id, payload.repositories)
    return {"success": True, "data": extracted}
