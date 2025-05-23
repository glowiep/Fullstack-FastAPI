from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from backend.fastapi.core.init_settings import global_settings as settings

from sqlalchemy.ext.automap import automap_base


# Synchronous engine and session
sync_engine = create_engine(settings.DB_URL)
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)

# Automap base to reflect existing tables
Base = automap_base()
Base.prepare(sync_engine, reflect=True)  # Reflect the existing schema

# Asynchronous engine and session
async_engine = create_async_engine(settings.ASYNC_DB_URL, echo=False, future=True)
AsyncSessionLocal = sessionmaker(bind=async_engine, expire_on_commit=False, class_=AsyncSession)

def init_db():
    Base.metadata.create_all(bind=sync_engine)

def get_sync_db():
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session
