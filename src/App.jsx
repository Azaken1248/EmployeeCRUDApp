import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Location from "./pages/Location";
import Employee from "./pages/Employee";
import Department from "./pages/Department";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="control-shell">
        <Routes>
          <Route path="/" element={<Location />} />
          <Route path="/location" element={<Location />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/department" element={<Department />} />
        </Routes>
      </main>
    </div>
  );
}

export default App
