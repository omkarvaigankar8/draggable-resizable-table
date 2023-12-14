import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    return (
        <Container maxWidth='xxl' sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '30px' }}>
            <Typography variant='h3'>Interview Tasks</Typography>
            {/* <></Button> */}
            <Box sx={{ display: 'flex', gap: '20px', }}>
                <Button variant='contained' onClick={() => navigate('/task1')}>Task 1</Button>

                <Button variant='contained' onClick={() => navigate('/task2')}>Task 2</Button>
            </Box>
        </Container>
    )
}

export default Home