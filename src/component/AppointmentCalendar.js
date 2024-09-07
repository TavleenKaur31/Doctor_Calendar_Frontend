import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // Drag-and-drop addon
import base_url from '../api/bootapi'; // Adjust the import based on your file structure

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar); // Wrap Calendar with drag-and-drop functionality

const Event = ({ event, onUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const startTime = moment(event.start).format('HH:mm');
  const endTime = moment(event.end).format('HH:mm');

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        width: '180px',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>{event.name}</div>
          <div style={{ fontSize: '11px',color: '#3b82f6' }}>{event.title}</div>
        </div>
        <IconButton
          aria-controls={open ? 'event-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      </div>
      <div style={{ color: '#6b7280', fontSize: '10px', marginTop: '4px' }}>
        {startTime} - {endTime}
      </div>

      <Menu
        id="event-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'event-menu-button',
        }}
      >
        <MenuItem onClick={() => { onUpdate(event); handleClose(); }}>Update</MenuItem>
        <MenuItem onClick={() => { onDelete(event.id); handleClose(); }}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', date: '' });

  useEffect(() => {
    axios.get(`${base_url}/api/appointments`)
      .then((response) => {
        const events = response.data.map(appointment => {
          const start = new Date(appointment.appointmentDateAndTime);
          const end = new Date(start);
          end.setHours(start.getHours() + 1);
          return {
            id: appointment.id || appointment.title,
            title: appointment.title,
            name: appointment.name,
            start: start,
            end: end
          };
        });
        setAppointments(events);
      })
      .catch((error) => {
        console.error('There was an error fetching the appointments!', error);
      });
  }, []);

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      title: event.title,
      date: moment(event.start).format('YYYY-MM-DDTHH:mm')
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
      appointmentDateAndTime: new Date(formData.date)
    };

    axios.put(`${base_url}/api/update-event`, updatedEvent)
      .then(() => {
        setAppointments(prevAppointments =>
          prevAppointments.map(event => event.id === updatedEvent.id ? updatedEvent : event)
        );
        handleCloseDialog();
      })
      .catch((error) => {
        console.error('There was an error updating the event!', error);
      });
  };

  const handleDeleteEvent = (id) => {
    axios.delete(`${base_url}/api/delete-event/${id}`)
      .then(() => {
        setAppointments(prevAppointments =>
          prevAppointments.filter(event => event.id !== id)
        );
      })
      .catch((error) => {
        console.error('There was an error deleting the event!', error);
      });
  };

  // Handle event drop
  // const handleEventDrop = ({ event, start, end }) => {
  //   const updatedEvent = {
  //     ...event,
  //     start: start,
  //     end: end
  //   };

  //   axios.put(`${base_url}/api/update-event`, updatedEvent)
  //     .then(() => {
  //       setAppointments(prevAppointments =>
  //         prevAppointments.map(e => e.id === updatedEvent.id ? updatedEvent : e)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error('There was an error updating the event after drag!', error);
  //     });
  // };
  const handleEventDrop = ({ event, start, end }) => {
  const updatedEvent = {
    ...event,
    appointmentDateAndTime: start, // Set the updated start time as appointmentDateAndTime
    start: start,
    end: end
  };

  axios.put(`${base_url}/api/update-event`, updatedEvent)
    .then(() => {
      setAppointments(prevAppointments =>
        prevAppointments.map(e => e.id === updatedEvent.id ? updatedEvent : e)
      );
    })
    .catch((error) => {
      console.error('There was an error updating the event after drag!', error);
    });
};


  return (
    <div>
      <h2>Appointments Calendar</h2>
      <DndProvider backend={HTML5Backend}>
        <DragAndDropCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          defaultView="month"
          selectable
          onEventDrop={handleEventDrop} // Handle drop event
          components={{
            event: (props) => <Event {...props} onUpdate={handleUpdateEvent} onDelete={handleDeleteEvent} />
          }}
        />
      </DndProvider>

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
          />
          <TextField
            margin="dense"
            label="Date and Time"
            type="datetime-local"
            name="date"
            fullWidth
            value={formData.date}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AppointmentCalendar;
