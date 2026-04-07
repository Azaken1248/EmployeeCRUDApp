import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/ToastProvider";
import Location from "./pages/Location";
import Employee from "./pages/Employee";
import Department from "./pages/Department";

function App() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App
