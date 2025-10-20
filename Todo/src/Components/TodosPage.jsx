// TodosPage.jsx
import React, { useContext, useEffect } from 'react';
import { TodoContext } from './TodoProvider';
import TodoList from './TodoList'; // Component for displaying todos
import Form from './Form';
import TodoFooter from './TodoFooter';
import { Stack } from "@mui/material";
function TodosPage() {
    const { todos, error, fetchTodos } = useContext(TodoContext);

    return (
        <Stack mt={10} sx={{width:'100%', height:'100%'}}>
            
            <Form /> 
            <TodoList />
            <TodoFooter />

        </Stack>
    );
}
export default TodosPage;