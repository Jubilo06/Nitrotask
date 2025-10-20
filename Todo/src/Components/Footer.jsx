import React from 'react'
import { Stack, Typography } from '@mui/material'
function Footer() {
  return (
    <Stack position="static" height='100px' pb={0} justifyContent="center" alignItems="center">
        <Typography width='100%' textAlign='center'>&copy; {new Date().getFullYear()} NitroTask App. All rights reserved.</Typography>
    </Stack>
)
}

export default Footer