class Settings:
    DB_URL = "sqlite:///./test.db"  
    ASYNC_DB_URL = "sqlite+aiosqlite:///./test.db"
    API_BASE_URL = "http://127.0.0.1:8000" 

settings = Settings()

# Define global_settings to avoid import errors
global_settings = {}

# Keep args in case it's used somewhere else
args = {}
