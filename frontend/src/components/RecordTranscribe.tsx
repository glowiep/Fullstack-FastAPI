import api from "../api/axios"
import { useState } from "react"
import { VscDebugStart } from "react-icons/vsc";
import { VscDebugRestart } from "react-icons/vsc";
import { MdOutlineStart } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";


const RecordTranscribe = () => {
    const [recording, setRecording] = useState(false);
    const [blobURL, setBlobURL] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const startRecording = () => setRecording(true);
    const stopRecording = () => setRecording(false);

    interface RecordedBlob {
        blobURL: string;
        blob: Blob;
    }

    const onStop = (recordedBlob: RecordedBlob) => {
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
            const response = await api.post("speech-to-text/upload-audio/", formData);
            console.log("Transcription:", response.data.transcription);
        } catch (error) {
            console.error("Error uploading audio:", error);
        }
    };

    return (
        <div className="mb-10">
            <h2>
                Record and Transcribe Audio
            </h2>
            <div className="flex flex-row items-center justify-center gap-4">
                <button className="flex flex-row items-center gap-2" onClick={startRecording}>
                    Start
                    <VscDebugStart />
                </button>
                <button className="flex flex-row items-center gap-2" onClick={stopRecording}>
                    Stop
                    <FaRegStopCircle />
                </button>
                <button className="flex flex-row items-center gap-2" onClick={uploadAudio}>
                    Upload
                    <MdOutlineStart />
                </button>
                <button className="flex flex-row items-center gap-2" onClick={() => console.log("restart???")}>
                    <VscDebugRestart />
                </button>
            </div>

            {/* Results */}
            <h2>Results</h2>
            <div>
                <h3>Transcription:</h3>
                <h3>Sentiment:</h3>
                <h3>Summary:</h3>
                <h3>Named Entities:</h3>
            </div>
        </div>
    )
};

export default RecordTranscribe;