from fastapi import FastAPI
from backend.fastapi.api.v1.endpoints import base, doc, classroom ,speech_to_text, genai, exportreport, notifications

def setup_routers(app: FastAPI):
    app.include_router(base.router, prefix="", tags=["main"])
    app.include_router(doc.router, prefix="/api", tags=["doc"])
    app.include_router(classroom.router, prefix="/api", tags=["classroom"])
    #from backend.fastapi.api.v1.endpoints import speech_to_text 
    app.include_router(speech_to_text.router, prefix="/api/v1/speech-to-text", tags=["speech-to-text"])  
    app.include_router(genai.router,prefix="/api",tags=["genai"])
    app.include_router(exportreport.router,prefix="/api",tags=["exportreport"])
    app.include_router(notifications.router,prefix="/api",tags=["notifications"])
