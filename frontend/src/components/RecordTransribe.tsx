import { useState } from "react";
import api from "../api/axios";
//import { useAudioRecorder } from "react-use-audio-recorder";
import { useAudioRecorder } from "react-use-audio-recorder/dist/index.js";
//import "react-use-audio-recorder/styles.css";  // # Import default styles
import { VscDebugStart, VscDebugRestart } from "react-icons/vsc";
import { MdOutlineStart } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";

const RecordTranscribe = () => {
    // # State to store audio data and results
    const [transcription, setTranscription] = useState<string | null>(null);
    const [sentiment, setSentiment] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [namedEntities, setNamedEntities] = useState<string[]>([]);

    // # Use `react-use-audio-recorder` for recording
    const {
        recordingStatus,   // # Status: "idle", "recording", "paused", "stopped"
        recordingTime,     // # Duration of the recording in seconds
        startRecording,    // # Function to start recording
        stopRecording,     // # Function to stop recording
        pauseRecording,    // # Function to pause recording
        resumeRecording,   // # Function to resume recording
        getBlob            // # Function to get recorded audio blob
    } = useAudioRecorder();

    // # Upload recorded audio to backend
    const uploadAudio = async () => {
        const audioBlob = getBlob();  // # Get audio data from recorder
        if (!audioBlob) {
            alert("No audio recorded!");
            return;
        }

        const formData = new FormData();
        formData.append("file", new File([audioBlob], "audio.wav", { type: "audio/wav" }));

        try {
            const response = await api.post("/api/v1/speech-to-text/upload-audio/", formData);
            setTranscription(response.data.transcription);
            setSentiment(response.data.sentiment);
            setSummary(response.data.summary);
            setNamedEntities(response.data.named_entities);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div className="mb-10">
            <h2>Record and Transcribe Audio</h2>

            <p>{`Recording Status: ${recordingStatus} | Time: ${recordingTime}s`}</p>  {/* # Show recording status & time */}

            <div className="flex flex-row items-center justify-center gap-4">
                <button 
                    disabled={recordingStatus === "recording"} 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => startRecording()}>
                    Start <VscDebugStart />
                </button>
                <button 
                    disabled={recordingStatus !== "recording"} 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => pauseRecording()}> 
                    Pause
                </button>
                <button 
                    disabled={recordingStatus !== "paused"} 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => resumeRecording()}> 
                    Resume
                </button>
                <button 
                    disabled={!(recordingStatus === "recording" || recordingStatus === "paused")} 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => stopRecording()}> 
                    Stop <FaRegStopCircle />
                </button>
                <button 
                    disabled={recordingStatus !== "stopped"} 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => uploadAudio()}> 
                    Upload <MdOutlineStart />
                </button>
                <button 
                    className="flex flex-row items-center gap-2" 
                    onClick={() => window.location.reload()}>
                    Restart <VscDebugRestart />
                </button>
            </div>

            {/* # Display results */}
            <h2>Results</h2>
            {transcription && <p><strong>Transcription:</strong> {transcription}</p>}
            {sentiment && <p><strong>Sentiment:</strong> {sentiment}</p>}
            {summary && <p><strong>Summary:</strong> {summary}</p>}
            {namedEntities.length > 0 && (
                <p><strong>Named Entities:</strong> {namedEntities.join(", ")}</p>
            )}
        </div>
    );
};

export default RecordTranscribe;
