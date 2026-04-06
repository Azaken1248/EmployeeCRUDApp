import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Location from "./pages/Location";
import Employee from "./pages/Employee";
import Department from "./pages/Department";

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Location />} />
          <Route path="/location" element={<Location />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/department" element={<Department />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
