import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import base_url from "../api/bootapi";
import { Add, MoreVert } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Swal from "sweetalert2";

const PatientList = () => {
  const [appointments, setAppointments] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    title: "",
    appointmentDateAndTime: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get(`${base_url}/api/appointments`)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setAppointments(data);
      })
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  const handleMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment); // Set the selected appointment
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (!selectedAppointment) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${base_url}/api/delete-event/${selectedAppointment.id}`)
          .then(() => {
            fetchAppointments(); // Refresh the list after deletion
            handleMenuClose();
            setSelectedAppointment(null); // Clear the selection after delete

            // Show success alert
            Swal.fire(
              "Deleted!",
              "The appointment has been deleted.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error deleting appointment:", error);
            Swal.fire(
              "Error!",
              "There was a problem deleting the appointment.",
              "error"
            );
          });
      }
    });
  };

  const handleOpenEditDialog = () => {
    if (selectedAppointment) {
      const formattedDate = new Date(selectedAppointment.appointmentDateAndTime)
        .toISOString()
        .slice(0, 16);
      setEditData({
        name: selectedAppointment.name,
        title: selectedAppointment.title,
        appointmentDateAndTime: formattedDate,
      });
      setOpenDialog(true);
      handleMenuClose(); // Close menu after opening dialog
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAppointment(null); // Clear the selected appointment when dialog is closed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = () => {
    if (!selectedAppointment) {
      console.error("No appointment selected for update.");
      return;
    }

    // Construct the updated appointment data
    const updatedAppointment = {
      id: selectedAppointment.id,
      name: editData.name,
      title: editData.title,
      appointmentDateAndTime: editData.appointmentDateAndTime,
    };

    // Call the update API
    axios
      .put(`${base_url}/api/update-event`, updatedAppointment)
      .then(() => {
        fetchAppointments(); // Refresh the list after update
        handleDialogClose(); // Close dialog after updating
      })
      .catch((error) => console.error("Error updating appointment:", error));
  };

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "16px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonOutlineIcon
              sx={{ fontSize: "40px", color: "blue", marginRight: "8px" }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize: "28px" }}
            >
              Patient List
            </Typography>
          </Box>

          {/* Add Button */}
          <Box>
            <IconButton
              sx={{
                backgroundColor: "blue",
                color: "white",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "darkblue" },
                width: "40px",
                height: "40px",
              }}
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ marginY: "10px" }} />

        {/* Total Appointments */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" color="black">
            <Box
              component="span"
              sx={{
                fontSize: "25px",
                fontWeight: "bold",
                paddingLeft: "13px",
                color: "blue",
              }}
            >
              {appointments.length}
            </Box>
            : Total Appointments
          </Typography>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Sr. No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date (Day)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment.id}>
                <TableCell sx={{ color: "black", fontWeight: "500" }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "500" }}>
                  {appointment.name}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "500" }}>
                  {appointment.title}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "500" }}>
                  {new Date(
                    appointment.appointmentDateAndTime
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell sx={{ color: "black", fontWeight: "500" }}>
                  {new Date(
                    appointment.appointmentDateAndTime
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, appointment)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={handleOpenEditDialog}>
                      Edit Patient
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>Delete Patient</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Date and Time"
            type="datetime-local"
            name="appointmentDateAndTime"
            value={editData.appointmentDateAndTime}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PatientList;
