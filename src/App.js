// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AppointmentCalendar from "./component/AppointmentCalendar";
// import Home from "./component/Home";
// import Sidebar from "./component/Sidebar"; // Import Sidebar
// import PatientList from "./component/PatientList ";
// import Main from "./component/Main";

// function App() {
//   return (
//     <Router>
//       <div style={{ display: "flex" }}>
//         {" "}
//         {/* Use flexbox to layout the Sidebar and main content */}
//         <Sidebar />
//         <div style={{ padding: "20px", flex: 1 }}>
//           {" "}
//           {/* Main content area */}
//           <Routes>
//             <Route path="/overview" element={<Home />} />
//             <Route path="/patients" element={<PatientList />} />
//             <Route path="/main" element={<Main />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./component/Sidebar";
import Home from "./component/Home";
import PatientList from "./component/PatientList ";
import Main from "./component/Main";
import Register from "./component/Register";
import Login from "./component/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div style={{ display: "flex" }}>
          <Sidebar /> {/* Sidebar only shows if authenticated */}
          <div style={{ padding: "20px", flex: 1 }}>
            <Routes>
              <Route path="/overview" element={<Home />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/main" element={<Main />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />{" "}
          {/* Redirect to Login for unknown routes */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
