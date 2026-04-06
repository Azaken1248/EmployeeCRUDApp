import React, { useState } from "react";
import ResponseDisplay from "../components/ResponseDisplay";

const BASE_URL = "https://employee.azaken.com/api";

function Employee() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState("");
  const [formData, setFormData] = useState({
    empName: "",
    email: "",
    phone: "",
    deptId: "",
    managerId: "",
    salary: "",
    hireDate: "",
    status: "ACTIVE",
  });

  const handleGetAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/employees`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: "/employees", data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: "/employees", error: err.message });
    }
    setLoading(false);
  };

  const handleGetById = async () => {
    if (!empId) {
      alert("Please enter an Employee ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/employees/${empId}`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: `/employees/${empId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: `/employees/${empId}`, error: err.message });
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!formData.empName || !formData.email || !formData.phone || !formData.deptId || !formData.salary) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "POST", endpoint: "/employees", data, status: res.status });
    } catch (err) {
      setResponse({ method: "POST", endpoint: "/employees", error: err.message });
    }
    setLoading(false);
  };

  const handlePut = async () => {
    if (!empId || !formData.empName || !formData.email || !formData.phone || !formData.deptId || !formData.salary) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/employees/${empId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "PUT", endpoint: `/employees/${empId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "PUT", endpoint: `/employees/${empId}`, error: err.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!empId) {
      alert("Please enter an Employee ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/employees/${empId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setResponse({ method: "DELETE", endpoint: `/employees/${empId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "DELETE", endpoint: `/employees/${empId}`, error: err.message });
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getMethodColor = (method) => {
    switch(method) {
      case "GET": return "bg-[#89dceb] text-[#1e1e2e]";
      case "POST": return "bg-[#a6e3a1] text-[#1e1e2e]";
      case "PUT": return "bg-[#f38ba8] text-[#1e1e2e]";
      case "DELETE": return "bg-[#f5c2b0] text-[#1e1e2e]";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-[#94e2d5]">Employee Control Panel</h3>

      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="empName"
            placeholder="Employee Name"
            value={formData.empName}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="deptId"
            placeholder="Department ID"
            value={formData.deptId}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="managerId"
            placeholder="Manager ID (Optional)"
            value={formData.managerId}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="date"
            name="hireDate"
            placeholder="Hire Date"
            value={formData.hireDate}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
          </select>
        </div>
      </div>

      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-3">
        <button
          onClick={handleGetAll}
          disabled={loading}
          className="w-full bg-[#89dceb] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
        >
          GET - Get All Employees
        </button>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <button
            onClick={handleGetById}
            disabled={loading}
            className="bg-[#89dceb] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
          >
            GET by ID
          </button>
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-[#a6e3a1] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
          >
            POST - Create
          </button>
          <button
            onClick={handlePut}
            disabled={loading}
            className="bg-[#f38ba8] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
          >
            PUT - Update
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-[#f5c2b0] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
          >
            DELETE
          </button>
        </div>
      </div>

      <ResponseDisplay response={response} getMethodColor={getMethodColor} />

      {loading && <p className="text-[#f5e0dc] text-center">Loading...</p>}
    </div>
  );
}

export default Employee;
