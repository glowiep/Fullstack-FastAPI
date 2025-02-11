import { useState } from "react";

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
        <div>
            <h2><strong>Action Required</strong></h2>
            <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Enter new action" />
            <button onClick={addItem} style={{ backgroundColor: "green", color: "white", marginLeft: "5px", padding: "3px 8px", fontSize: "12px" }}>Add</button>
            <ul style={{ marginTop: "10px", listStyleType: "disc", paddingLeft: "20px" }}>
                {items.map((item, index) => (
                    <li key={index} style={{ listStyleType: "disc", marginBottom: "5px" }}>
                        {item} <button onClick={() => deleteItem(index)} style={{ backgroundColor: "red", color: "white", border: "none", cursor: "pointer", padding: "3px 8px", fontSize: "12px", marginLeft: "10px" }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActionList;