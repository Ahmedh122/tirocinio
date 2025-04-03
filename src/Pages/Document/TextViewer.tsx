import { Box, Paper } from '@mui/material'
import React from 'react'

const TextViewer = ({text}:{text:string}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "95%",
        padding: 1,
        overflow:'auto'
       
      }}
    >
        <Box  sx={{padding:3}}>{text}</Box></Paper>
  );
}

export default TextViewer