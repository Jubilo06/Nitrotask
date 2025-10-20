import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
export const TodoContext = createContext();
import api from "./Api";

export function TodoProvider({children}){
    const { user, token, logout } = useContext(AuthContext);
    const [todos, setTodos]=useState([]);
    const [currentTodo, setCurrentTodo] = useState(null);
    const completedtodo=todos.filter((todo)=>todo.done).length;
    const totaltodo=todos.length;
    const [todo, setTodo]=useState({name:"",  description: "",
        done:false,
        category: "General",
    dueDate: null,
    priority: 0,
    isMeeting: false,           // NEW
    meetingMembers: []
    });
      // For authentication
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const fetchTodos = async () => {
    //     if (!user || !token) { // Don't fetch if no user is logged in
    //         setTodos([]);
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         // The 'api' instance already adds the Authorization header via interceptor
    //         const response = await api.get(`/api/todos?userId=${user._id}`); // Or backend could infer from token
    //         setTodos(response.data);
    //         setError(null);
    //     } catch (err) {
    //         console.error("Failed to fetch todos:", err);
    //         setError("Failed to load todos. Please try again.");
    //         if (err.response?.status === 401) {
    //             logout(); // Force logout if token is invalid/expired
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchTodos();
    // }, [user, token]);
    const saveTodoToApi = useCallback(async (method, endpoint, data = null) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (method) {
                case 'post':
                    response = await api.post(endpoint, data);
                    break;
                case 'put':
                    response = await api.put(endpoint, data);
                    break;
                case 'delete':
                    response = await api.delete(endpoint);
                    break;
                case 'get':
                    response = await api.get(endpoint);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
            setError(errorMessage);
            console.error(`API Error (${method} ${endpoint}):`, err);
            throw new Error(errorMessage); // Re-throw to be handled by the caller
        }
    }, []);
    const fetchTodos = useCallback(async () => {
        try {
            const data = await saveTodoToApi('get', '/api/todos'); // Endpoint for all todos
            setTodos(data);
        } catch (err) {
            // Error already set by saveTodoToApi
        }
    }, [saveTodoToApi]);
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);
    
    
     // Example of sorting with new fields
    const sortedTodo = todos.slice().sort((a, b) => {
        if (a.done !== b.done) {
            return Number(a.done) - Number(b.done);
        }
        // Then by priority (e.g., higher number means higher priority)
        if (a.priority !== b.priority) {
            return b.priority - a.priority; // Descending priority
        }
        // Then by due date
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });
    // // Renamed from loadUserInvoices
    const loadUserTodos = useCallback(async () => {
        if (!user || !token) { // Only load if user is authenticated
            setTodos([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/todos'); // Endpoint change
            setTodos(response.data); // State update logic remains same
        } catch (error) {
            console.error("Failed to load todos:", error);
            setTodos([]); // Clear list on error
            setError("Failed to load todos. Please try again.");
            if (error.response?.status === 401) {
                logout(); // Force logout if token is invalid/expired
            }
        } finally {
            setLoading(false);
        }
    }, [user, token, logout]); // Dependencies for useCallback

    //  const addTodo = async (newTodo) => {
    //     try {
    //         // No need for explicit token/config - `api` instance handles it!
    //         const response = await api.post("/api/todos", newTodo);
    //         setTodos((prevTodos) => [response.data, ...prevTodos]);
    //         setError(null);
    //         // Component using this function can display success message
    //         return response.data; // Return the created todo
    //     } catch (err) {
    //         console.error("Failed to add todo:", err);
    //         setError("Failed to add todo.");
    //         throw err; // Re-throw for component-specific error handling
    //     }
    // };
    // const saveTodoToApi = useCallback(async (todoDataForm) => {
    //     try {
    //         const response = await api.post('/api/todos', todoDataForm);
    //         setTodos(prevList => [response.data, ...prevList]);
    //         console.log("Todos state after add:", todos)
    //         setTodo(response.data);
    //         return response.data; // Return the saved todo
    //     } catch (error) {
    //         console.error("API Save Todo Error:", error);
    //         throw error; // Re-throw to be handled by the component
    //     }
    // }, []);
    
    const addTodo = useCallback(async (newTodoData) => {
        try {
            const addedTodo = await saveTodoToApi('post', '/api/todos', newTodoData);
            console.log("TodoContext: API returned addedTodo with dueDate:", addedTodo.dueDate);
            setTodos(prevTodos => [addedTodo, ...prevTodos]); // Add new todo to the beginning
            setCurrentTodo(addedTodo); // Optionally set the new one as current
            return addedTodo;
        } catch (err) {
            // Error already set by saveTodoToApi
            throw err;
        }
    }, [saveTodoToApi]);

    // const addTodo = useCallback(async (todoData) => {
    //     try {
    //         const savedTodo = await saveTodoToApi(todoData);
    //         alert('Todo/Meeting saved successfully!'); // Alert can be here or in component
    //         return savedTodo;
    //     } catch (error) {
    //         console.error("Error adding todo via context:", error);
    //         // Optionally set a global error state here
    //         throw new Error("Failed to save todo/meeting. Please try again.");
    //     }
    // }, [saveTodoToApi]);

    // --- Update Todo ---
    // const updateTodo = async (id, updatedFields) => {
    //     try {
    //         // No need for explicit token/config - `api` instance handles it!
    //         const response = await api.put(`/api/todos/${id}`, updatedFields);
    //         setTodos((prevTodos) =>
    //             prevTodos.map((t) => (t._id === id ? response.data : t))
    //         );
    //         setError(null);
    //         // Component using this function can display success message
    //         return response.data; // Return the updated todo
    //     } catch (err) {
    //         console.error("Failed to update todo:", err);
    //         setError("Failed to update todo.");
    //         throw err;
    //     }
    // };
    const updateTodo = useCallback(async (id, updatedTodoData) => {
        try {
            const updated = await saveTodoToApi('put', `/api/todos/${id}`, updatedTodoData);
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo._id === id ? updated : todo))
            );
            if (currentTodo && currentTodo._id === id) {
                setCurrentTodo(updated); // Update currentTodo if it's the one being updated
            }
            return updated;
        } catch (err) {
            // Error already set by saveTodoToApi
            throw err;
        }
    }, [saveTodoToApi, currentTodo]);

    // --- Delete Todo ---
    // const deleteTodo = async (id) => {
    //     try {
    //         // No need for explicit token/config - `api` instance handles it!
    //         await api.delete(`/api/todos/${id}`);
    //         setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id));
    //         setError(null);
    //         // Component using this function can display success message
    //     } catch (err) {
    //         console.error("Failed to delete todo:", err);
    //         setError("Failed to delete todo.");
    //         throw err;
    //     }
    // };
    const deleteTodo = useCallback(async (id) => {
        try {
            await saveTodoToApi('delete', `/api/todos/${id}`);
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            if (currentTodo && currentTodo._id === id) {
                setCurrentTodo(null); // Clear currentTodo if it was deleted
            }
            return true;
        } catch (err) {
            // Error already set by saveTodoToApi
            throw err;
        }
    }, [saveTodoToApi, currentTodo]);
    const selectTodo = useCallback((todoItem) => {
        setCurrentTodo(todoItem);
    }, []);
    const clearSelectedTodo = useCallback(() => {
        setCurrentTodo(null);
    }, []);
    // const saveCurrentTodoForm = useCallback(async (todoDataForm) => { // Takes form data as argument
    //     try {
    //         const response = await api.post('/api/todos', todoDataForm); // Endpoint change
    //         setTodos(prevList => [response.data, ...prevList]); // Add to list
    //         setTodo(response.data); // Set the newly saved one as current
    //         alert('Todo item saved to your account!'); // Message change
    //         return response.data;
    //     } catch (error) {
    //         console.error("API Save Todo Form Error:", error);
    //         alert('Failed to save todo item from form.');
    //         throw error;
    //     }
    // }, []);

    // --- useEffect to load todos when the component mounts or user changes ---
    // useEffect(() => {
    //     if (user && token) { // Load todos only if user is authenticated
    //         loadUserTodos();
    //     } else {
    //         setTodos([]); // Clear todos if no user is logged in
    //     }
    // }, [user, token, loadUserTodos]);
     useEffect(() => {
        console.log("TodoContext - Current Todos State:", todos);
        if (todos && todos.length > 0) {
            todos.forEach(todo => console.log(`  - Todo: ${todo.name} (ID: ${todo._id})`));
        }
    }, [todos]);


    const value={
        todos, setTodos, completedtodo, totaltodo, todo, setTodo, sortedTodo, 
        setError, loadUserTodos,
        loading,
        error,
        currentTodo,
        setCurrentTodo,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        selectTodo,
        clearSelectedTodo,
    }
    return(
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    )
}