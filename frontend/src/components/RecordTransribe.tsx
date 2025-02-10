import { useState, useRef } from "react";  // # Added `useRef` for MediaRecorder
import api from "../api/axios";
import { VscDebugStart, VscDebugRestart } from "react-icons/vsc";
import { MdOutlineStart } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";

const RecordTranscribe = () => {
    const [recording, setRecording] = useState(false);
    const [blobURL, setBlobURL] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null); // # Added: To store transcription
    const [sentiment, setSentiment] = useState<string | null>(null); // # Added: To store sentiment analysis result
    const [summary, setSummary] = useState<string | null>(null); // # Added: To store text summary
    const [namedEntities, setNamedEntities] = useState<string[]>([]); // # Added: To store named entities

    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // # Added: Ref to store MediaRecorder instance
    const audioChunksRef = useRef<Blob[]>([]); // # Added: Ref to store recorded audio chunks

    // Start Recording using MediaRecorder API
    const startRecording = async () => {  // # Modified: Uses MediaRecorder API instead of react-mic
        setRecording(true);
        audioChunksRef.current = []; // # Reset previous audio chunks

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data); // # Store recorded audio chunks
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                setAudioBlob(audioBlob);
                setBlobURL(URL.createObjectURL(audioBlob)); // # Create a URL for playback
            };

            mediaRecorder.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    // Stop Recording
    const stopRecording = () => {  // # Modified: Uses MediaRecorder API
        setRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    // Upload Audio to FastAPI Backend
    const uploadAudio = async () => {
        if (!audioBlob) {
            alert("No audio recorded!");
            return;
        }

        const formData = new FormData();
        formData.append("file", new File([audioBlob], "audio.wav", { type: "audio/wav" }));

        try {
            const response = await api.post("speech-to-text/upload-audio/", formData);
            setTranscription(response.data.transcription); // # Added: Store API response
            setSentiment(response.data.sentiment); // # Added: Store sentiment analysis result
            setSummary(response.data.summary); // # Added: Store text summary
            setNamedEntities(response.data.named_entities); // # Added: Store named entities
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div className="mb-10">
            <h2>Record and Transcribe Audio</h2>

            <audio controls src={blobURL} /> {/* # Added: Playback recorded audio */}

            <div className="flex flex-row items-center justify-center gap-4">
                <button disabled={recording} className="flex flex-row items-center gap-2" onClick={startRecording}>
                    Start <VscDebugStart />
                </button>
                <button disabled={!recording} className="flex flex-row items-center gap-2" onClick={stopRecording}>
                    Stop <FaRegStopCircle />
                </button>
                <button disabled={!audioBlob} className="flex flex-row items-center gap-2" onClick={uploadAudio}>
                    Upload <MdOutlineStart />
                </button>
                <button className="flex flex-row items-center gap-2" onClick={() => window.location.reload()}>
                    Restart <VscDebugRestart />
                </button>
            </div>

            {/* Results Section */}
            <h2>Results</h2>
            {transcription && <p><strong>Transcription:</strong> {transcription}</p>} {/* # Added: Display transcription */}
            {sentiment && <p><strong>Sentiment:</strong> {sentiment}</p>} {/* # Added: Display sentiment */}
            {summary && <p><strong>Summary:</strong> {summary}</p>} {/* # Added: Display summary */}
            {namedEntities.length > 0 && (
                <p><strong>Named Entities:</strong> {namedEntities.join(", ")}</p>  {/* # Added: Display named entities */}
            )}
        </div>
    );
};

export default RecordTranscribe;
