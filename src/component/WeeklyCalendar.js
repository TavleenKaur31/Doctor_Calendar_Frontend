import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import base_url from "../api/bootapi"; // Adjust the import based on your file structure
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import the adapter

const AppointmentCard = ({ appointment, onUpdate, onDelete }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    Swal.fire({
      title: "Appointment Accepted!",
      text: "This appointment has been accepted.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      setIsAccepted(true); // Disable the "Accept" button after clicking
    });
  };

  const handleReschedule = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reschedule this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reschedule it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdate(appointment); // Call the onUpdate function to open the dialog

        // Show success alert
        Swal.fire(
          "Rescheduled!",
          "The appointment has been rescheduled.",
          "success"
        );
      }
    });
  };

  const handleDeleteClick = () => {
    onDelete(appointment.id); // Call the onDelete function with the appointment id
  };

  return (
    <Card
      style={{
        marginBottom: "10px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <CardContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`https://randomuser.me/api/portraits/med/men/${appointment.id}.jpg`}
            alt={appointment.name}
            style={{
              borderRadius: "50%",
              width: 40,
              height: 40,
              marginRight: 15,
            }}
          />
          <div>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, fontSize: 15 }}
            >
              {appointment.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 600 }}
            >
              {appointment.title}
            </Typography>
          </div>
        </div>

        <div style={{ textAlign: "center", flexGrow: 1 }}>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {moment(appointment.start).format("h:mm a")} -{" "}
            {moment(appointment.end).format("h:mm a")}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", marginTop: "10px" }}>
            <Button
              variant="outlined"
              style={{
                marginRight: "10px",
                backgroundColor: isAccepted ? "#f0f0f0" : "blue",
                color: isAccepted ? "darkgrey" : "white",
                pointerEvents: isAccepted ? "none" : "auto",
              }}
              onClick={handleAccept}
              disabled={isAccepted}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              style={{ marginRight: "10px" }}
              onClick={handleReschedule}
            >
              Reschedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const WeeklyCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", title: "", date: null });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [newEvent, setNewEvent] = useState({
    appointmentDateAndTime: null, // Initialize with null or a date object
    // ...other fields
  });

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = () => {
    const startOfWeek = moment(selectedDate).startOf("week").toISOString();
    const endOfWeek = moment(selectedDate).endOf("week").toISOString();

    axios
      .get(`${base_url}/api/appointments`, {
        params: { start: startOfWeek, end: endOfWeek },
      })
      .then((response) => {
        const events = response.data.map((appointment) => {
          const start = new Date(appointment.appointmentDateAndTime);
          const end = new Date(start);
          end.setHours(start.getHours() + 1);
          return {
            id: appointment.id || appointment.title,
            title: appointment.title,
            name: appointment.name,
            start: start,
            end: end,
          };
        });

        // Sort events in descending order
        const sortedEvents = events.sort((a, b) => {
          return b.start - a.start; // Sorting by start date
        });

        setAppointments(sortedEvents);
      })
      .catch((error) => {
        console.error("There was an error fetching the appointments!", error);
      });
  };

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      title: event.title,
      date: moment(event.start).format("YYYY-MM-DDTHH:mm"),
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    const updatedEvent = {
      ...selectedEvent,
      name: formData.name,
      title: formData.title,
      start: new Date(formData.date),
      end: new Date(new Date(formData.date).getTime() + 60 * 60 * 1000),
      appointmentDateAndTime: new Date(formData.date),
    };

    axios
      .put(`${base_url}/api/update-event`, updatedEvent)
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("There was an error updating the event!", error);
      });
  };

  const handleDeleteEvent = (id) => {
    axios
      .delete(`${base_url}/api/delete-event/${id}`)
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.filter((event) => event.id !== id)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the event!", error);
      });
  };

  const goToPreviousWeek = () => {
    setSelectedDate(moment(selectedDate).subtract(1, "week").toDate());
  };

  const goToNextWeek = () => {
    setSelectedDate(moment(selectedDate).add(1, "week").toDate());
  };

  // Filter days that have appointments
  const daysWithAppointments = appointments.reduce((days, appointment) => {
    const day = moment(appointment.start).format("ddd, MMM D");
    if (!days.includes(day)) {
      days.push(day);
    }
    return days;
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        <Button onClick={goToPreviousWeek}>{"<"}</Button>
        <Typography variant="h6">
          {moment(selectedDate).format("MMMM YYYY")}
        </Typography>
        <Button onClick={goToNextWeek}>{">"}</Button>
      </div>

      {daysWithAppointments.map((day, index) => {
        const formattedDay = moment(day).format("ddd"); // Day of the week
        const formattedDate = moment(day).format("MMM D"); // Month and date

        return (
          <div key={index} style={{ margin: "20px 0" }}>
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              <span style={{ fontWeight: "normal" }}>{formattedDay} , </span>
              <span style={{ fontWeight: "bold" }}>{formattedDate}</span>
            </Typography>
            {appointments
              .filter(
                (appointment) =>
                  moment(appointment.start).format("ddd, MMM D") === day
              )
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
          </div>
        );
      })}

      {/* Update Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date and Time"
              ampm={true} // Enables AM/PM option
              value={formData.date ? dayjs(formData.date) : null} // Ensure value is a Day.js object
              onChange={(newValue) => {
                setNewEvent({ ...newEvent, appointmentDateAndTime: newValue });
                handleFormChange({
                  target: {
                    name: "date",
                    value: newValue ? newValue.toISOString() : null,
                  },
                }); // Update the formData state as well
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
