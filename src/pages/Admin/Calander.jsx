import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  useMediaQuery,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";

const Calendar = () => {
  const isMdDevices = useMediaQuery("(max-width:920px)");
  const isSmDevices = useMediaQuery("(max-width:600px)");
  const isXsDevices = useMediaQuery("(max-width:380px)");
  const [currentEvents, setCurrentEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");

  const handleDateClick = (selected) => {
    // Set the selected date and open the dialog
    setSelectedDate(selected.dateStr);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventTitle("");
  };

  const handleSaveEvent = () => {
    if (eventTitle) {
      const newEvent = {
        id: `${selectedDate}-${eventTitle}`,
        title: eventTitle,
        start: selectedDate,
        end: selectedDate,
        allDay: true,
      };

      setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
      setOpenDialog(false);
      setEventTitle("");
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  // Filter out past events
  const filteredEvents = currentEvents.filter((event) => {
    const today = new Date();
    const eventDate = new Date(event.start);
    return eventDate >= today;
  });

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      
      <Box display="flex" justifyContent="space-between" gap={2}>
        {/* CALENDAR SIDEBAR */}
        <Box
          display={`${isMdDevices ? "none" : "block"}`}
          flex="1 1 20%"
          bgcolor="#e5e7eb" // Replace with a color of your choice
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {filteredEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  bgcolor: "#eab308", // Set event background to yellow-500
                  my: "10px",
                  borderRadius: "12px",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                  }
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box
          flex="1 1 100%"
          sx={{
            "& .fc-list-day-cushion": {
              bgcolor: "lightgreen !important", // Customize color as needed
            },
            "& .fc-button-primary": {
              bgcolor: "green", // Set button background color to green
              color: "white",
              "&:hover": {
                bgcolor: "darkgreen", // Set hover effect
              },
            },
            "& .fc-daygrid-day": {
              "&.fc-day-today": {
                bgcolor: "yellow.100 !important", // Light yellow for today's date
              },
            },
          }}
        >
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: `${isSmDevices ? "prev,next" : "prev,next today"}`,
              center: "title",
              right: `${
                isXsDevices
                  ? ""
                  : isSmDevices
                  ? "dayGridMonth,listMonth"
                  : "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
              }`,
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={[
              {
                id: "12316",
                title: "Team Meeting",
                date: "2024-12-05",
                start: "2024-12-05T10:00:00",
                end: "2024-12-05T11:00:00",
                allDay: false,
              },
              {
                id: "12317",
                title: "Project Deadline",
                date: "2024-12-10",
                start: "2024-12-10T23:59:00",
                end: "2024-12-11T00:00:00",
                allDay: true,
              },
              {
                id: "12318",
                title: "Holiday Celebration",
                date: "2024-12-24",
                start: "2024-12-24T18:00:00",
                end: "2024-12-24T22:00:00",
                allDay: false,
              },
              {
                id: "12319",
                title: "New Year Party",
                date: "2025-01-01",
                start: "2025-01-01T20:00:00",
                end: "2025-01-02T02:00:00",
                allDay: false,
              },
            ]}
            eventContent={(eventInfo) => {
              return (
                <div className="bg-yellow-500 text-black p-2 rounded">
                  {eventInfo.event.title}
                </div>
              );
            }}
          />
        </Box>
      </Box>

      {/* Dialog for event creation */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Set Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;