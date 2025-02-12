import { useState } from 'react';
import { FaMagic } from 'react-icons/fa';
import Modal from '../components/Modal';
import api from '../api/axios';

import Sidebar from "../components/Sidebar";

const BehaviorsSection = () => {
    const [behaviorInput, setBehaviorInput] = useState("");
    const [recommendedBehavior, setRecommendedBehavior] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    const handleGetRecommendedBehavior = async () => {
        // {
        //     "course_name": "string",
        //     "description": "string",
        //     "grade_level": 0
        //   }
        const params = {
            "course_name": "string",
            "description": behaviorInput,
            "grade_level": 0
        }
        try {
            const response = await api.post('/recommend_metrics', params);
            setRecommendedBehavior(response.data.observations || ["No observations found"]);  // Right now the response doesnt return what we need so it returns the default "No observations found"
        } catch (error) {
            console.error('Error fetching observations:', error);
        }
    };
    
    const handleSaveBehavior = async () => {
        // {
        //     "course_name": "string",
        //     "description": "string",
        //     "grade_level": 0
        //   }
        const params = {
            "course_name": "string",
            "description": behaviorInput,
            "grade_level": 0
        }
        try {
            const response = await api.post('/recommend_metrics', params);
            setRecommendedBehavior(response.data.observations || ["No observations found"]);  // Right now the response doesnt return what we need so it returns the default "No observations found"
        } catch (error) {
            console.error('Error fetching observations:', error);
        }
    };
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="AI Recommended Behaviors" onConfirm={handleSaveBehavior} />
            <div className="flex flex-col bg-gray-100 w-full items-center">
                <h1>Behavior Tracking</h1>
                <div className="flex flex-row p-4 gap-2">
                    <input placeholder="Enter behavior" 
                        className='flex items-center w-96 rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600'
                        type="behavior" 
                        value={behaviorInput} 
                        onChange={(e) => setBehaviorInput(e.target.value)}
                    />
                    <div className="">
                        <button onClick={handleGetRecommendedBehavior} className="flex flex-row items-center justify-center gap-2">
                            Add Behaviors
                        </button>
                    </div>
                    {recommendedBehavior}
                </div>
                <div className="p-2">
                    <button onClick={() => setShowModal(!showModal)} className="flex flex-row items-center justify-center gap-2">
                        AI Recommended Behaviors
                        <FaMagic />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default BehaviorsSection;