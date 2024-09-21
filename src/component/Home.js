import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import the adapter
import dayjs from "dayjs";
import Swal from "sweetalert2"; // Import SweetAlert
import base_url from "../api/bootapi";

const Home = () => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    title: "",
    appointmentDateAndTime: dayjs(),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDate = newEvent.appointmentDateAndTime.toISOString();

    const eventToSend = {
      ...newEvent,
      appointmentDateAndTime: formattedDate,
    };

    try {
      await axios.post(`${base_url}/api/add-event`, eventToSend);
      console.log("Appointment saved:", eventToSend);

      // Show SweetAlert on success
      Swal.fire({
        icon: "success",
        title: "Appointment Saved!",
        text: "Your appointment has been successfully added.",
        confirmButtonText: "OK",
      });

      setNewEvent({
        name: "",
        title: "",
        appointmentDateAndTime: dayjs(),
      });
    } catch (error) {
      console.error("There was an error saving the appointment:", error);

      // Show SweetAlert on error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
        confirmButtonText: "OK",
      });
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
            sx={{ mb: 4 }}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Appointment Date and Time"
              ampm={true} // Enables AM/PM option
              value={newEvent.appointmentDateAndTime}
              onChange={(newValue) =>
                setNewEvent({ ...newEvent, appointmentDateAndTime: newValue })
              }
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>

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
