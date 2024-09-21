import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import { Dashboard, CalendarToday, People } from "@mui/icons-material";
import Logoo from "../assets/NirmiteeLogo.jpg";
import DentistImage from "../assets/dentist.jpeg";

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column", // Ensure content is in a column
    justifyContent: "space-between", // Push content to take full height
    height: "100vh", // Full height of the view
    border: "none", // Remove border if present
    overflow: "hidden", // Prevent scrolling in the drawer
  },
});

const Logo = styled(Typography)({
  fontWeight: "bold",
  color: "#29B6F6",
  fontSize: "24px",
  padding: "16px",
});

const Footer = styled(Box)({
  width: "100%",
  padding: "16px",
  textAlign: "center",
  borderTop: "1px solid #eee",
  marginTop: "auto", // Pushes footer to the end
  position: "relative", // Ensure it's positioned relative to its container
  zIndex: 1, // Ensure it stays on top
  backgroundColor: "#fff", // Ensure background color is set
});

const menuItems = [
  { text: "Overview", icon: <Dashboard />, path: "/overview" },
  { text: "Calendar", icon: <CalendarToday />, path: "/main" },
  { text: "Patient List", icon: <People />, path: "/patients" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent" anchor="left">
      {/* Header with Logo */}
      <Box sx={{ padding: "16px", textAlign: "center" }}>
        <Logo>
          <img
            src={Logoo}
            alt="Logo"
            style={{ width: 200, height: "auto", marginBottom: 16 }}
          />
        </Logo>
      </Box>

      {/* Main content */}
      <List sx={{ flexGrow: 1 }}>
        {" "}
        {/* Takes up remaining space */}
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ textDecoration: "none" }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "#29B6F6" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  color:
                    location.pathname === item.path ? "#29B6F6" : "inherit",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Footer section */}
      <Footer sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          alt="Drg. Adam H."
          src={DentistImage}
          sx={{ width: 56, height: 56, marginRight: 2 }}
        />
        <div>
          <Typography variant="subtitle1" fontWeight="bold">
            Drg. Adam H.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Dentist
          </Typography>
        </div>
      </Footer>
    </StyledDrawer>
  );
};

export default Sidebar;
