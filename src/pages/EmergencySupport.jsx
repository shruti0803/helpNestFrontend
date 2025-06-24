import React from 'react';
import {
  Typography,
  Button,
  Paper,
  Box
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const emergencyItems = [
  {
    title: '24x7 Helpline',
    icon: <PhoneInTalkIcon sx={{ mr: 1 }} />,
    text: '📞 +91-99999-88888',
    button: <Button variant="contained" color="secondary">Call Now</Button>,
  
  },
  {
    title: 'Request Ambulance',
    icon: <LocalHospitalIcon sx={{ mr: 1 }} />,
    text: 'We will notify your nearby hospital for ambulance assistance.',
    button: <Button variant="outlined" color="error">Request Medical Help</Button>,
   
  },
  {
    title: 'Panic Button',
    icon: <WarningAmberIcon sx={{ mr: 1 }} />,
    text: 'Sends instant alert to your emergency contacts and admin.',
    button: <Button variant="contained" color="warning">Send Panic Alert</Button>,
    
  },
  {
    title: 'Chat with Support',
    icon: <SupportAgentIcon sx={{ mr: 1 }} />,
    text: 'Talk to a support agent for quick help or clarification.',
    button: <Button variant="contained" color="primary">Start Chat</Button>,
    
  },
  {
    title: 'Share Live Location',
    icon: <LocationOnIcon sx={{ mr: 1 }} />,
    text: 'Let us locate you quickly in case of emergency.',
    button: <Button variant="outlined" color="info">Share My Location</Button>,
   
  },
  {
    title: 'First Aid Guidance',
    icon: <TipsAndUpdatesIcon sx={{ mr: 1 }} />,
    text: 'Learn how to handle bleeding, fainting, or fractures until help arrives.',
    button: <Button variant="outlined" color="success">View Tips</Button>,
   
  },
];

const EmergencySupport = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #a18cd1, #fbc2eb)',
        padding: '100px 20px',
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="white" align="center" gutterBottom>
        🚨 Emergency Support Portal
      </Typography>

      <Typography variant="subtitle1" color="white" align="center" gutterBottom>
        We are here for you — in case of any emergency, please use the options below.
      </Typography>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '40px',
        }}
      >
        {emergencyItems.map((item, index) => (
          <Paper
            key={index}
            elevation={6}
            style={{
              width: '360px',
              height: '200px',
              padding: '24px',
              backgroundColor: item.bg,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              {item.icon} {item.title}
            </Typography>
            <Typography variant="body1" style={{ flexGrow: 1 }}>
              {item.text}
            </Typography>
            <Box mt={2}>{item.button}</Box>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default EmergencySupport;
