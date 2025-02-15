import { useState } from "react";
import api from "../api/axios";
//import { useAudioRecorder } from "react-use-audio-recorder";
import { useAudioRecorder } from "react-use-audio-recorder/dist/index.js";
//import "react-use-audio-recorder/styles.css";  // # Import default styles
import { VscDebugStart, VscDebugRestart } from "react-icons/vsc";
import { MdOutlineStart } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";

const RecordTranscribe = () => {
    // # Stating to store audio data and results
    const [transcription, setTranscription] = useState<string | null>(null);
    const [sentiment, setSentiment] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [namedEntities, setNamedEntities] = useState<string[]>([]);

    // # Using `react-use-audio-recorder` for recording
    const {
        recordingStatus,  
        recordingTime,    
        startRecording,   
        stopRecording,    
        pauseRecording,   
        resumeRecording,  
        getBlob           
    } = useAudioRecorder();

    // # Uploading recorded audio to backend
    const uploadAudio = async () => {
        const audioBlob = getBlob();  // # it Gets audio data from recorder
        if (!audioBlob) {
            alert("No audio recorded!");
            return;
        }

        const formData = new FormData();
        formData.append("file", new File([audioBlob], "audio.wav", { type: "audio/wav" }));

        try {
            const response = await api.post("/v1/speech-to-text/upload-audio/", formData);
            setTranscription(response.data.transcription);
            setSentiment(response.data.sentiment);
            setSummary(response.data.summary);
            setNamedEntities(response.data.named_entities);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Record and Transcribe Audio</h2>
            <p style={{ marginBottom: "15px" }}>{`Recording Status: ${recordingStatus || "Not started"} | Time: ${recordingTime}s`}</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {/* # Start Recording */}
                <button
                    disabled={recordingStatus === "recording"}
                    style={{
                        backgroundColor: recordingStatus === "recording" ? "#cccccc" : "#28a745",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: recordingStatus === "recording" ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={startRecording}>
                    <VscDebugStart />
                    <span>Start</span>
                </button>

                {/* # Pause Recording */}
                <button
                    disabled={recordingStatus !== "recording"}
                    style={{
                        backgroundColor: recordingStatus === "recording" ? "#ffc107" : "#cccccc",
                        color: "black",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: recordingStatus === "recording" ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={pauseRecording}>
                    Pause
                </button>

                {/* # Resume Recording */}
                <button
                    disabled={recordingStatus !== "paused"}
                    style={{
                        backgroundColor: recordingStatus === "paused" ? "#ffc107" : "#cccccc",
                        color: "black",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: recordingStatus === "paused" ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={resumeRecording}>
                    Resume
                </button>

                {/* # Stop Recording */}
                <button
                    disabled={!(recordingStatus === "recording" || recordingStatus === "paused")}
                    style={{
                        backgroundColor: (recordingStatus === "recording" || recordingStatus === "paused") ? "#dc3545" : "#cccccc",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: (recordingStatus === "recording" || recordingStatus === "paused") ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={stopRecording}>
                    <FaRegStopCircle />
                    <span>Stop</span>
                </button>

                {/* # Upload Audio */}
                <button
                    disabled={recordingStatus !== "stopped"}
                    style={{
                        backgroundColor: recordingStatus === "stopped" ? "#007bff" : "#cccccc",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: recordingStatus === "stopped" ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={uploadAudio}>
                    <MdOutlineStart />
                    <span>Upload</span>
                </button>

                {/* # Restart Page */}
                <button
                    style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                    onClick={() => window.location.reload()}>
                    <VscDebugRestart />
                    <span>Restart</span>
                </button>
            </div>

            {/* # Display results if available */}
            {transcription || sentiment || summary || namedEntities.length > 0 ? (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "white", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Results</h2>
                    {transcription && <p><strong>Transcription:</strong> {transcription}</p>}
                    {sentiment && <p><strong>Sentiment:</strong> {sentiment}</p>}
                    {summary && <p><strong>Summary:</strong> {summary}</p>}
                    {namedEntities.length > 0 && (
                        <p><strong>Named Entities:</strong> {namedEntities.join(", ")}</p>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default RecordTranscribe;