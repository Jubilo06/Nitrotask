import { useState, useContext } from "react";
import Todoitem from "./Todoitem";
import styles from "./todolist.module.css";
import { Stack } from "@mui/material";
import { TodoContext } from "./TodoProvider";

function TodoList(){
    const { todos,loading, error, deleteTodo, selectTodo, updateTodo } = useContext(TodoContext);
    const undoneTodos = todos.filter(todo => !todo.done);
    const doneTodos = todos.filter(todo => todo.done);
    const handleToggleDone = async (todoId, currentDoneStatus) => {
        try {
            await updateTodo(todoId, { done: !currentDoneStatus });
        } catch (error) {
            console.error("Failed to toggle todo status:", error);
            // Handle error, e.g., show a toast notification
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await deleteTodo(id);
                alert('Todo deleted successfully!');
            } catch (err) {
                alert(`Failed to delete todo: ${err.message}`);
                console.error("Error deleting todo from list:", err);
            }
        }
    };

    const handleEdit = (todoItem) => {
        selectTodo(todoItem); // Set the selected todo in context for the form to pick up
    };

    if (loading && todos.length === 0) {
        return <p>Loading todos...</p>;
    }

    if (error && todos.length === 0) {
        return <p style={{ color: 'red' }}>Error loading todos: {error}</p>;
    }

    if (!todos || todos.length === 0) {
        return <p>You haven't added any todos yet!</p>;
    }

    return(
        <Stack className={styles.todolist} height='100%' width={{xs:"100%", sm:"100%",md:"100%"}}>
            <h2>Your Tasks</h2>
            {loading && <p>Performing action...</p>}
            <ul>
                {todos.map(todoItem => (
                    
                    <li >
                        <div onClick={() => selectTodo(todoItem)}>
                            <h3>{todoItem.name}</h3>
                            {todoItem.description && <p>{todoItem.description}</p>}
                            <p>Category: {todoItem.category}</p>
                            {todoItem.dueDate && (
                                <p>Due: {new Date(todoItem.dueDate).toLocaleDateString()} {new Date(todoItem.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            )}
                            <p>Priority: {todoItem.priority}</p>

                            {/* FIX STARTS HERE */}
                            {todoItem.isMeeting && todoItem.meetingMembers && todoItem.meetingMembers.length > 0 && (
                                <p>
                                    Meeting with:&nbsp;
                                    {todoItem.meetingMembers.map((member, index) => (
                                        <span key={index}>
                                            {member.name} ({member.email})
                                            {index < todoItem.meetingMembers.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            )}
                            {/* Optional: message for meetings with no members */}
                            {todoItem.isMeeting && (!todoItem.meetingMembers || todoItem.meetingMembers.length === 0) && (
                                <p>Meeting (no members specified)</p>
                            )}
                            {/* FIX ENDS HERE */}

                            {todoItem.done && <span >Completed</span>}
                        </div>
                        {/* ... other buttons/controls */}
                    </li>
                ))}
            </ul>
            <div>
                <h1>Tasks To Do</h1>
                {undoneTodos.length === 0 ? (
                    <p>No tasks to do!</p>
                ) : (
                    <Stack direction='column' spacing={3}>
                        {undoneTodos.map(todo => (
                            <Stack key={todo._id} direction='row' spacing={2}>
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => handleToggleDone(todo._id, todo.done)}
                                />
                               &nbsp; {todo.name} - Priority: {todo.priority}
                                <Stack direction='row' spacing={2}>
                                    <button onClick={() => selectTodo(todo)}>Edit</button>
                                    <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                                </Stack>
                                
                            </Stack>
                        ))}
                    </Stack>
                )}

                <h1>Completed Tasks</h1>
                {doneTodos.length === 0 ? (
                    <p>No completed tasks yet.</p>
                ) : (
                    <ul>
                        {doneTodos.map(todo => (
                            <li key={todo._id} style={{ textDecoration: 'line-through', color: '#888' }}>
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => handleToggleDone(todo._id, todo.done)}
                                />
                                {todo.name} - Completed
                                <button onClick={() => selectTodo(todo)}>Edit</button> {/* Still allow editing */}
                                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Stack>
    )
}
export default TodoList;