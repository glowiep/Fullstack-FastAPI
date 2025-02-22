from fastapi import FastAPI
from backend.fastapi.api.v1.endpoints import base, doc, classroom, genai, exportreport, notifications
def setup_routers(app: FastAPI):
    app.include_router(base.router, prefix="", tags=["main"])
    app.include_router(doc.router, prefix="/api", tags=["doc"])
    app.include_router(classroom.router,prefix="/api",tags=["Classroom"])
    app.include_router(genai.router,prefix="/api",tags=["genai"])
    app.include_router(exportreport.router,prefix="/api",tags=["exportreport"])
    app.include_router(notifications.router,prefix="/api",tags=["notifications"])
