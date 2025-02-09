import os
from fastapi import APIRouter, UploadFile, File
from transformers import pipeline
import shutil

router = APIRouter()

# Loading Hugging Face Whisper Model
speech_recognizer = pipeline("automatic-speech-recognition", model="openai/whisper-base")


@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    """Handles audio file uploads, transcribes speech, and returns the text."""
    
    # Ensure temp directory exists
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    temp_audio_path = os.path.join(temp_dir, file.filename)
    
    with open(temp_audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert Speech to Text
    transcript = speech_recognizer(temp_audio_path)["text"]

    return {"transcription": transcript}
