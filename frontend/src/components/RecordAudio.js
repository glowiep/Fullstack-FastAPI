import React, { useState } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";

const RecordAudio = () => {
    const [recording, setRecording] = useState(false);
    const [blobURL, setBlobURL] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    const startRecording = () => setRecording(true);
    const stopRecording = () => setRecording(false);

    const onStop = (recordedBlob) => {
        setBlobURL(recordedBlob.blobURL);
        setAudioBlob(recordedBlob.blob);
    };

    const uploadAudio = async () => {
        if (!audioBlob) {
            alert("No audio recorded!");
            return;
        }

        const formData = new FormData();
        formData.append("file", new File([audioBlob], "audio.wav", { type: "audio/wav" }));

        try {
            const response = await axios.post("http://127.0.0.1:8000/speech-to-text/upload-audio/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Transcription:", response.data.transcription);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div>
            <h2>Record & Transcribe Audio</h2>
            <ReactMic
                record={recording}
                onStop={onStop}
                mimeType="audio/wav"
            />
            <button onClick={startRecording}>Start</button>
            <button onClick={stopRecording}>Stop</button>
            {blobURL && <audio controls src={blobURL}></audio>}
            {blobURL && <button onClick={uploadAudio}>Upload</button>}
        </div>
    );
};

export default RecordAudio;
