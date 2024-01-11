import { Box, Typography } from '@mui/material'
import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

function Faqs() {
    return (
        <Box>
            <Typography style={{ padding: 5, ml: 3 }}>Frequently Asked Questions</Typography>

            <Box>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        How to connect to Telegram Bot?
                    </AccordionSummary>
                    <AccordionDetails>
                        In order to set up Telegram, you must install Telegram to your mobile device and sign up. After you installed Telegram and registered, click on the Search field on the top of the application and search for "@myhenribot" and add it. After that, click Start and type /start and follow the steps. You will find your Telegram chat ID in your profile section.
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default Faqs