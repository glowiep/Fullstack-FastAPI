from sqlalchemy import Column, String, Integer
from backend.fastapi.dependencies.database import Base

class Transcription(Base):
    __tablename__ = "transcriptions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
