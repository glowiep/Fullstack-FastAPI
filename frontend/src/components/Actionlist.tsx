import { useState } from "react";
import { MdDelete } from "react-icons/md";

const ActionList = () => {
    const [items, setItems] = useState<string[]>(["Attendance Follow-up", "Report Submissions", "Feedback Collection", "Performance Reviews"]);
    const [newItem, setNewItem] = useState("");

    const addItem = () => {
        if (newItem.trim() !== "") {
            setItems([...items, newItem]);
            setNewItem("");
        }
    };

    const deleteItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2><strong>Action Required</strong></h2>
            <div className="flex flex-row mb-2">
                <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Enter new action" className="border rounded border-gray-300" />
                <button onClick={addItem} style={{ backgroundColor: "green", color: "white", marginLeft: "5px", padding: "3px 8px", fontSize: "12px" }}>Add</button>
            </div>
            <ul style={{ marginTop: "10px", listStyleType: "disc", paddingLeft: "20px" }}>
                {items.map((item, index) => (
                    <li key={index} style={{ listStyleType: "disc", marginBottom: "5px" }}>
                        {item} <button onClick={() => deleteItem(index)} style={{ backgroundColor: "red", color: "white", border: "none", cursor: "pointer", padding: "3px 8px", fontSize: "12px", marginLeft: "10px" }}><MdDelete size="1.25em" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActionList;