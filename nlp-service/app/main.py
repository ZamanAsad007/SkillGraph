from fastapi import FastAPI

from app.routes import router

app = FastAPI(title="SkillGraph NLP Service", version="0.1.0")


@app.get("/health")
def health() -> dict:
    return {"success": True, "data": {"service": "nlp-service", "status": "ok"}}


app.include_router(router, prefix="/api/v1")
