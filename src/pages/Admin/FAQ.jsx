import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const faqs = [
    {
      category: 'Services',
      question: 'How can I add a new service?',
      answer:
        'To add a new service, go to the "Services" section in the dashboard. Click on "Add New Service," fill in the required details such as name, description, and pricing, and submit.',
    },
    {
      category: 'Services',
      question: 'How do I update an existing service?',
      answer:
        'To update an existing service, navigate to the "Services" section. Find the service you want to edit, click on the "Edit" button, make the necessary changes, and save.',
    },
    {
      category: 'User',
      question: 'How can I manage permissions for a user?',
      answer:
        'Go to the "Users" section in the dashboard. Select the user whose permissions you want to modify. Click on "Manage Permissions" and choose the appropriate roles and access levels.',
    },
    {
      category: 'User',
      question: 'How can I report a user?',
      answer:
        'To report a user, navigate to the "Users" section, select the user you want to report, and click on the "Report User" button. Provide a reason for reporting and submit.',
    },
    {
      category: 'Reports',
      question: 'How do I resolve reports?',
      answer:
        'In the "Reports" section, locate the report you want to resolve. Click on the "Resolve" button, confirm your action, and the report will be marked as resolved.',
    },
    {
      category: 'Payment',
      question: 'How do I send salaries to employees?',
      answer:
        'Navigate to the "Payroll" section. Select the employee, enter the salary amount, and click on "Send Salary." Ensure you have sufficient funds in your account.',
    },
    {
      category: 'Payment',
      question: 'What should I do if the salary amount is less than the amount to pay?',
      answer:
        'If the salary is less than the amount to pay, ensure funds are added to your account. You can also contact the finance team to resolve any discrepancies.',
    },
  ];

  const [expanded, setExpanded] = useState(false);
  const [filteredFAQs, setFilteredFAQs] = useState(faqs);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      setFilteredFAQs(faqs);
    } else {
      setFilteredFAQs(faqs.filter((faq) => faq.category === category));
    }
  };

  return (
    <Box>
      {/* Gradient Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg,rgb(236, 115, 226),rgb(237, 105, 237))',
          marginRight:'12px',
          color: 'black',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '12px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Hello, how can we help?
        </Typography>
        <Typography variant="h6">
          Or choose a category to quickly find the help you need.
        </Typography>
        <Box mt={2}>
          <TextField
            variant="outlined"
            placeholder="Search articles"
            fullWidth
            sx={{
              maxWidth: '500px',
              background: 'white',
              borderRadius: '5px',
            }}
          />
        </Box>
      </Box>

      {/* Category Filters */}
      <Box
        sx={{
          background: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        {['All', 'Payment', 'User', 'Services', 'Reports'].map((category) => (
          <Button
            key={category}
            variant="contained"
            onClick={() => handleCategoryClick(category)}
            sx={{
              textTransform: 'capitalize',
              background:'purple'
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* FAQ Section */}
      <Box p={3}>
        {filteredFAQs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ;