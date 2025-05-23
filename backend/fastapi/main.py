import os
import uvicorn
from fastapi import FastAPI
# from fastapi.templating import Jinja2Templates
# from fastapi.staticfiles import StaticFiles
from backend.fastapi.core.init_settings import args
from backend.fastapi.core.middleware import setup_cors, setup_session, add_doc_protect
from backend.fastapi.core.routers import setup_routers
from fastapi.middleware.cors import CORSMiddleware

# Initiate a FastAPI App.
app = FastAPI()

# Default to "http://localhost:3000" for development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Add CORS middleware
  

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allow the React frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend
# templates = Jinja2Templates(directory="frontend/login/templates")
# app.mount("/static", StaticFiles(directory="frontend/login/static"), name="static")

# Set Middleware
setup_cors(app)
add_doc_protect(app)
setup_session(app)

# Setup Routers
setup_routers(app)

if __name__ == "__main__":
    uvicorn.run(
        app="backend.fastapi.main:app",
        host = args.host,
        port=int(os.getenv("PORT", 49152)),
        reload=args.mode == "dev"
    )
