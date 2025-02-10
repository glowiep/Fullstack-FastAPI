#import os
import shutil
import tempfile 
from fastapi import APIRouter, UploadFile, File
from transformers import pipeline

router = APIRouter()

# Loading all models once (for performance)
speech_recognizer = pipeline("automatic-speech-recognition", model="openai/whisper-base")
sentiment_analyzer = pipeline("sentiment-analysis")
summarizer = pipeline("summarization")
ner_analyzer = pipeline("ner")

@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    """Handles audio file uploads, transcribes speech, runs NLP models, and returns structured results."""

    # # Ensuring temp directory exists so we could save the file temp 
    # temp_dir = "temp"
    # os.makedirs(temp_dir, exist_ok=True)
        # Save audio in memory (no temp directory needed)


    # Use a temporary file instead of saving to `temp/`
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_audio.flush()  # Ensure all data is written before processing

        # Convert Speech to Text
        transcript = speech_recognizer(temp_audio.name)["text"]

    # Sentiment Analysis
    sentiment = sentiment_analyzer(transcript)[0]["label"]

    # Summarization (Only if transcript is long enough)
    summary = summarizer(transcript)[0]["summary_text"] if len(transcript.split()) > 20 else transcript

    # Named Entity Recognition (NER, for detecting names, dates, etc.)
    named_entities = [entity["word"] for entity in ner_analyzer(transcript)]

    return {
        "transcription": transcript,
        "sentiment": sentiment,
        "summary": summary,
        "named_entities": named_entities if named_entities else ["No named entities detected"]
    }
