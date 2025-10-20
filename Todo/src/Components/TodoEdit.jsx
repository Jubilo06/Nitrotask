// TodoItem.jsx
import React, { useContext, useState, useEffect } from 'react';
import { TodoContext } from './TodoProvider';

function TodoEdit() {
    const { updateTodo, deleteTodo,todos, loadingTodos, error, fetchTodos, todo } = useContext(TodoContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(todo.name);

    const handleToggleDone = async () => {
        try {
            await updateTodo(todo._id, { done: !todo.done });
        } catch (error) {
            console.error("Failed to toggle todo status:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await deleteTodo(todo._id);
            } catch (error) {
                console.error("Failed to delete todo:", error);
            }
        }
    };

    const handleEditSave = async () => {
        try {
            await updateTodo(todo._id, { name: editedName });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save edited todo:", error);
        }
    };
    useEffect(() => {
        fetchTodos(); // Load todos when the component mounts or user changes
    }, [fetchTodos]); // fetchTodos is memoized by useCallback in TodoProvider

    if (loadingTodos) return <div>Loading todos...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <li>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                    />
                    <button onClick={handleEditSave}>Save</button>
                </>
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={handleToggleDone}
                    />
                    <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                        {todo.name}
                    </span>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </li>
    );
}
export default TodoEdit;