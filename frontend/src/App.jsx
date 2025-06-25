import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserActivity from "./pages/UserActivity"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-activity" element={<UserActivity />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;


