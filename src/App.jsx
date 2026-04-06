import { useState } from "react";
import Navbar from "./components/Navbar";
import Location from "./pages/Location";
import Employee from "./pages/Employee";
import Department from "./pages/Department";

function App() {
  const [page, setPage] = useState("location");

  return (
    <div>
      <Navbar page={page} setPage={setPage} />
      <div className="p-6">
        {page === "location" && <Location />}
        {page === "employee" && <Employee />}
        {page === "department" && <Department />}
      </div>
    </div>
  );
}

export default App
