import styles from "./footer.module.css";
import { Stack } from "@mui/material";
import { useContext } from "react";
import { TodoContext } from "./TodoProvider";

function TodoFooter(){
     const {todos,setTodos, completedtodo, totaltodo, todo, setTodo }= useContext(TodoContext)
    return(
        <Stack className={styles.foot} pb={10} height='100px' direction='row' spacing={2} style={{width:'100%'}}>
            <Stack pl={2} className={styles.item}>Completed Tasks: {completedtodo}</Stack>
            <Stack pr={2} className={styles.item}>Total Tasks: {totaltodo}</Stack>
        </Stack>
    )
}
export default TodoFooter;