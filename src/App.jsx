import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Landing Page Route */}
        <Route path="/" element={<Landing />} />
        
        {/* Login Page Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />}  />
          <Route path="/dashboard" element={<Dashboard />}  />
      </Routes>
    </Router>
  );
}

export default App;