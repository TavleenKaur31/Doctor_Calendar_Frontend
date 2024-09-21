import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AppointmentCalendar from "./AppointmentCalendar";
import WeeklyCalendar from "./WeeklyCalendar";
import Typography from "@mui/material/Typography";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Divider } from "@mui/material";

const Main = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CalendarTodayIcon sx={{ mr: 1, color: "blue" }} />
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Calendar
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ width: "100%", typography: "body1", mt: 3 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Weekly" value="1" />
              <Tab label="Monthly" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <WeeklyCalendar />
          </TabPanel>
          <TabPanel value="2">
            <AppointmentCalendar />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default Main;
