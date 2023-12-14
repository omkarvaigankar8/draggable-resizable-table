import React, { useState, useEffect } from 'react';
import { Container as MainWrapper, Button, Box, Typography } from '@mui/material';
import { Container, Section, Bar } from '@column-resizer/react';
import DenseTable from '../components/NormalTable';
import { useNavigate } from 'react-router-dom';

const Custom = () => {
    const [showBottom, setShowBottom] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [showRight, showBottom]);
    return (
        <MainWrapper maxWidth='xxl'>
            <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '30px', width: '100%' }}>
                <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>

                <Typography variant='h3' sx={{ textAlign: 'center', width: '100%' }}>Task 2</Typography>
            </Box>
            <Box>
                <Button variant='contained' onClick={() => setShowRight(!showRight)}>
                    Right Column
                </Button>
                <Button variant='contained' onClick={() => setShowBottom(!showBottom)}>
                    Bottom Column
                </Button>
            </Box>

            <Container className="page">
                <Section>
                    <div className="left-side">
                        <Container vertical={true} style={{ height: 'calc(100vh - 100px)', background: '#80808080' }}>
                            <Section>
                                <div className={`${showBottom ? 'top-panel' : 'full-height-panel'}`}>
                                    <Typography className="section-head">Top Pane</Typography>
                                    <DenseTable />
                                </div>
                            </Section>
                            <><Bar size={10} className='bar' />
                                <Section className={`${!showBottom ? 'bottom-section-hide' : 'bottom-panel'}`}>
                                    {showBottom &&
                                        <div className="bottom-panel">
                                            <Typography className="section-head">Bottom Pane</Typography>
                                        </div>}
                                </Section></>
                        </Container>
                    </div>
                </Section>
                <> <Bar size={10} className='bar bar-col' />
                    <Section className={`${!showRight && 'right-section-hide'}`} minSize={!showRight ? 0 : 300}>
                        {showRight && <div className="right-side">
                            <Typography className="column-head">Right Pane</Typography>

                        </div>}
                    </Section></>
            </Container>
        </MainWrapper>
    );
};

export default Custom;
