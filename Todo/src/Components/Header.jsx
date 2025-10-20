import styles from "./Header.module.css";
import { Stack, Typography } from "@mui/material";

function Header(){
    return ( 
        <Stack className={styles.header} width={{xs:"100%", sm:"100%",md:"100%"}}>
           <Typography variant="h4">My Todo List</Typography>
        </Stack>
    )
}
export default Header;