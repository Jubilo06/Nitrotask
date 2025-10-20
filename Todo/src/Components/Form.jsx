import { useState, useContext, useEffect, useCallback } from "react";
import styles from "./Form.module.css";
import { Stack } from "@mui/material";
import { TodoContext } from "./TodoProvider";
import api from "./Api";


function Form(){
    const teader={color:"blue", borderRadius:"10px", border:"2px solid blue",fontSize:"20px", marginLeft:"10px"}
    const {todos, setTodos, completedtodo, totaltodo, todo, setTodo, loading,addTodo,selectTodo,
        clearSelectedTodo,updateTodo,
        error, setError, currentTodo }= useContext(TodoContext)
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [newMemberMethod, setNewMemberMethod] = useState('email');
    const [formLocalError, setFormLocalError] = useState('');

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        done: false,
        category: "General",
        dueTime: "",
        dueDate: "", // Use string for input, convert to Date if needed before sending to backend
        priority: 0,
        isMeeting: false,
        meetingMembers: []
    });
    const resetForm = useCallback(() => {
        setFormData({
            name: "",
            description: "",
            done: false,
            category: "General",
            dueTime: "",
            dueDate: "",
            priority: 0,
            isMeeting: false,
            meetingMembers: []
        });
        setFormLocalError('');
        clearSelectedTodo(); // Clear currentTodo in context when form is reset
    }, [clearSelectedTodo]);
    useEffect(() => {
        console.log("TodoForm useEffect: currentTodo changed to", currentTodo);
        if (currentTodo) {
            console.log("  - currentTodo.dueDate raw value:", currentTodo.dueDate);

            let formattedDueDate = "";
            let formattedDueTime = "";
            if (currentTodo.dueDate) { // Only attempt to create a Date object if currentTodo.dueDate exists
                const dateObj = new Date(currentTodo.dueDate);
                console.log("  - dateObj after new Date():", dateObj);

                // Check if dateObj is a valid Date before calling methods
                if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
                    const watDateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Africa/Lagos' };
                    const watTimeOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Africa/Lagos' };

                    const watDateString = dateObj.toLocaleDateString('en-CA', watDateOptions); // 'en-CA' gives YYYY-MM-DD
                    const watTimeString = dateObj.toLocaleTimeString('en-GB', watTimeOptions);
                    formattedDueDate = watDateString; // e.g., "2023-10-27"
                    formattedDueTime = watTimeString; // e.g., "15:30"
                    console.log("  - formattedDueDate (WAT):", formattedDueDate);
                    console.log("  - formattedDueTime (WAT):", formattedDueTime);
                } else {
                    console.warn("  - currentTodo.dueDate could not be parsed into a valid Date:", currentTodo.dueDate);
                }
            } else {
                console.log("  - currentTodo.dueDate is null/undefined/empty string.");
            }
            setFormData({
                name: currentTodo.name || "",
                description: currentTodo.description || "",
                done: currentTodo.done || false,
                category: currentTodo.category || "General",
                dueTime: formattedDueTime,
                dueDate: formattedDueDate,
                priority: currentTodo.priority || 0,
                isMeeting: currentTodo.isMeeting || false,
                meetingMembers: currentTodo.meetingMembers || []
            });
        } else {
            // Reset form if currentTodo is cleared (e.g., after saving or canceling edit)
            console.log("  - currentTodo is null, resetting form.");
            resetForm();
        }
    }, [currentTodo, resetForm]);
    const handleMeetingMembersChange = useCallback((e) => {
        setFormData(prevData => ({
            ...prevData,
            meetingMembers: e.target.value.split(',').map(m => m.trim()).filter(m => m) // Split by comma, trim, filter empty
        }));
    }, []);
    
    const handleAddMember = () => {
        if (!newMemberEmail.trim()) {
            alert("Please provide an email for the meeting member.");
            return;
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(newMemberEmail.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        const member = {
            name: newMemberName.trim() || newMemberEmail.trim().split('@')[0], // Default name from email
            email: newMemberEmail.trim(),
            phoneNumber: newMemberPhone.trim(), // Keep if needed
            notificationMethod: newMemberMethod // Keep if needed
        };

        setFormData(prevData => ({
            ...prevData,
            meetingMembers: [...prevData.meetingMembers, member]
        }));

        // Clear member input fields after adding
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberPhone('');
        setNewMemberMethod('email');
    };
     const handleRemoveMember = useCallback((indexToRemove) => {
        setFormData(prevData => ({
            ...prevData,
            meetingMembers: prevData.meetingMembers.filter((_, index) => index !== indexToRemove)
        }));
    }, []);
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : (name === 'priority' ? Number(value) : value)
        }));
    }, []);

    // Special handler for date input, as value is a string, and we might want Date object
    const handleDateChange = (e) => {
        const dateValue = e.target.value; // This will be a string "YYYY-MM-DD"
        setTodo(prevTodo => ({
            ...prevTodo,
            dueDate: dateValue ? new Date(dateValue) : null // Convert to Date object or null
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLocalError('');
        if (!formData.name.trim()) {
            setFormLocalError("Todo name cannot be empty.");
            return;
        }
        if (formData.isMeeting && formData.meetingMembers.length === 0) {
            setFormLocalError("A meeting must have at least one team member.");
            return;
        }
        if (formData.isMeeting && formData.meetingMembers.some(member => !member.email.trim())) {
             setFormLocalError("All meeting members must have a valid email address.");
             return;
         }
         let combinedDueDate = null;
        if (formData.dueDate && formData.dueTime) {
            const localDateTimeString = `${formData.dueDate}T${formData.dueTime}:00`;
            const inputDate = new Date(localDateTimeString);
            const year = parseInt(formData.dueDate.substring(0, 4), 10);
            const month = parseInt(formData.dueDate.substring(5, 7), 10) - 1; // Month is 0-indexed
            const day = parseInt(formData.dueDate.substring(8, 10), 10);
            const hour = parseInt(formData.dueTime.substring(0, 2), 10);
            const minute = parseInt(formData.dueTime.substring(3, 5), 10);
             const watOffsetHours = 1; // Africa/Lagos is UTC+1

            combinedDueDate = new Date(Date.UTC(year, month, day, hour - watOffsetHours, minute));
            console.log("Saving UTC Date (should be 1hr less than input):", combinedDueDate.toISOString());

            // combinedDueDate = dateAsUTC;
        } else if (formData.dueDate) {
            const year = parseInt(formData.dueDate.substring(0, 4), 10);
            const month = parseInt(formData.dueDate.substring(5, 7), 10) - 1;
            const day = parseInt(formData.dueDate.substring(8, 10), 10);
            const watOffsetHours = 1; // Africa/Lagos is UTC+1
            combinedDueDate = new Date(Date.UTC(year, month, day, 0 - watOffsetHours, 0));
            console.log("Saving UTC Date (midnight WAT):", combinedDueDate.toISOString());
        }

        const todoDataToSend = {
            ...formData,
             dueDate: combinedDueDate ? combinedDueDate.toISOString() : null,
            dueTime: undefined,
            priority: Number(formData.priority) // Ensure priority is a number
        };

        try {
            if (currentTodo) {
                await updateTodo(currentTodo._id, todoDataToSend);
                alert('Todo/Meeting updated successfully!');
            } else {
                await addTodo(todoDataToSend);
                alert('Todo/Meeting added successfully!');
            }
            resetForm(); // Reset form fields and clear selected todo
        } catch (err) {
            setFormLocalError(error || err.message || "Failed to save todo/meeting. Please try again.");
            console.error("Error from TodoForm submit:", err);
        }
    };
    
    return (
        <Stack width="100%" height='auto' justifyContent='center' alignItems='center'>
            <Stack width={{xs:"90%", sm:"60%", md:'40%'}} justifyContent='center' alignItems='center'  
            borderRadius={5}  height='auto'>
                <form onSubmit={handleSubmit} style={{width:'100%',height:'100%'}}>
                    <Stack  direction="column" spacing={2} width={{xs:"100%", sm:"100%",md:"100%"}}>
                        <h2>Add New Task / Meeting</h2>
                    {formLocalError && <p>{formLocalError}</p>}
                    {error && <p >Global Todo Error: {error}</p>} {/* Display context-level error */}
                        <input type="text" style={{width:'60%'}}  name="name" required disabled={loading} placeholder="Enter a todo item..." value={formData.name} onChange={handleChange}></input>
                        <textarea
                            className={styles.textAreaInput}
                            placeholder="Add a detailed description..."
                            name="description" // Important: Add name attribute
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                            style={{width:'60%'}}
                            rows="3"
                        ></textarea>
                        <select
                            style={{width:'60%'}}
                            name="category" // Important: Add name attribute
                            value={formData.category}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="General">General</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Health">Health</option>
                        </select>

                        <input
                            type="date" 
                            style={{width:'60%'}}
                            name="dueDate" 
                            value={formData.dueDate} 
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <label style={{width:'60%'}}>
                            Due Time:
                            <input
                                type="time"
                                style={{width:'100%'}} // Make it 100% of its parent label
                                name="dueTime"
                                value={formData.dueTime}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </label>
                    <div>
                        <label>Priority:</label>
                        <label>
                            <input
                                type="radio"
                                name="priority"
                                value="0" 
                                checked={Number(formData.priority) === 0} 
                                onChange={handleChange}
                                disabled={loading}
                            /> Low
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="priority"
                                value="1"
                                checked={Number(formData.priority) === 1}
                                onChange={handleChange}
                                disabled={loading}
                            /> Medium
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="priority"
                                value="2"
                                checked={Number(formData.priority) === 2}
                                onChange={handleChange}
                                disabled={loading}
                            /> High
                        </label>

                    </div>

                    <label>
                        <input
                            type="checkbox"
                            name="isMeeting"
                            checked={formData.isMeeting}
                            onChange={handleChange}
                            disabled={loading}
                        /> Is this a Team Meeting?
                    </label>

                        {formData.isMeeting && (
                            <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '15px', width: '60%' }}>
                                <h3>Meeting Members</h3>
                                <Stack spacing={3}>
                                    <input
                                        type="text"
                                        placeholder="Member Name (optional)"
                                        value={newMemberName}
                                        onChange={(e) => setNewMemberName(e.target.value)}
                                        disabled={loading}
                                        style={{ marginRight: '5px', width: 'calc(50% - 5px)' }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Member Email"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        disabled={loading}
                                        style={{ width: 'calc(50% - 5px)' }}
                                    />
                                    
                                    <button type="button" onClick={handleAddMember} disabled={loading} style={{ marginTop: '10px', width: '100%', padding: '8px' }}>
                                        Add Member
                                    </button>
                                </Stack>

                                {/* Display current members */}
                                {formData.meetingMembers.length > 0 && (
                                    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                        <h4>Added Members:</h4>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {formData.meetingMembers.map((member, index) => (
                                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dotted #eee' }}>
                                                    <span>
                                                        {member.name} ({member.email})
                                                    </span>
                                                    <button type="button" onClick={() => handleRemoveMember(index)} disabled={loading} style={{ background: 'salmon', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', cursor: 'pointer' }}>
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {formData.meetingMembers.length === 0 && (
                                    <p style={{ marginTop: '10px', color: '#555' }}>No meeting members added yet.</p>
                                )}
                            </div>
                        )}
                        
                        {currentTodo && (
                            <div>
                                <label htmlFor="done">Done?</label>
                                <input
                                    type="checkbox"
                                    id="done"
                                    name="done"
                                    checked={formData.done}
                                    onChange={handleChange}
                                    disabled={loading}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        )}

                        {formLocalError && <p className="error-message" style={{ color: 'red' }}>{formLocalError}</p>}
                        {error && <p className="error-message" style={{ color: 'red' }}>Context Error: {error}</p>}


                        <button style={{width:'150px', height:'30px', borderRadius:'5px 5px'}} type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (currentTodo ? 'Update Todo' : 'Add Todo')}
                        </button>
                        {currentTodo && ( 
                            <button type="button" onClick={resetForm} disabled={loading}>
                                Cancel Edit
                            </button>
                        )}
                    </Stack>
                </form>
            </Stack>
        </Stack>
    )
}
export default Form;