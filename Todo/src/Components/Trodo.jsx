import { useState, useContext } from "react";
import TodoList from "./TodoList";
import Form from "./Form";
import Footer from "./TodoFooter";
import {Stack} from '@mui/material';
import { TodoContext } from "./TodoProvider";

function Todo(){
    const {todos, setTodos, completedtodo, totaltodo, todo, setTodo }= useContext(TodoContext)
    
    return(
        <Stack direction='column' height='100%' spacing={1}>
            <Stack><Form /></Stack>
            <Stack><TodoList /></Stack>
            <Stack><Footer /></Stack>
        </Stack>
    );
}
export default Todo;