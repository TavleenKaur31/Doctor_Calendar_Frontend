import React, { useState } from "react";
import axios from "axios"; // Import Axios
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import Logo from "../assets/NirmiteeLogo.jpg";
import base_url from "../api/bootapi";
const Home = () => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    title: "",
    appointmentDateAndTime: "",
  });

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDate = new Date(
      newEvent.appointmentDateAndTime
    ).toISOString();

    const eventToSend = {
      ...newEvent,
      appointmentDateAndTime: formattedDate,
    };

    try {
      await axios.post(`${base_url}/api/add-event`, eventToSend);
      console.log("Appointment saved:", eventToSend);

      setNewEvent({
        name: "",
        title: "",
        appointmentDateAndTime: "",
      });
    } catch (error) {
      console.error("There was an error saving the appointment:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ marginBottom: 2 }}
        >
          Calendar
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold" 
          color="grey.700"
          sx={{ whiteSpace: "nowrap" }}
        >
          Book your appointment today, schedule and reschedule with our best
          doctors!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
         <TextField
          margin="normal"
           required
            fullWidth
            type="datetime-local"
              value={newEvent.appointmentDateAndTime}
               onChange={(e) =>
               setNewEvent({ ...newEvent, appointmentDateAndTime: e.target.value })
                  }
                   />


          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Appointment
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;