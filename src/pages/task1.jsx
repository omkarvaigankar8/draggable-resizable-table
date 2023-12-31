import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import CustomTable from '../components/Table';

const Task1 = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth='xxl'>
            <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '30px', width: '100%' }}>
                <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>
                <Typography variant='h3' sx={{ textAlign: 'center', width: '100%' }}>Task 1</Typography>
            </Box>
            <CustomTable />
        </Container >
    )
}

export default Task1