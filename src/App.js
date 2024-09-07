import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppointmentCalendar from './component/AppointmentCalendar';
import Home from './component/Home';
import Sidebar from './component/Sidebar'; // Import Sidebar
import PatientList from './component/PatientList ';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}> {/* Use flexbox to layout the Sidebar and main content */}
        <Sidebar />
        <div style={{ padding: '20px', flex: 1 }}> {/* Main content area */}
          <Routes>
            <Route path="/calendar" element={<AppointmentCalendar />} />
            <Route path="/overview" element={<Home />} />
              <Route path="/patients" element={<PatientList/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
