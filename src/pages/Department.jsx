import React, { useState } from "react";
import ResponseDisplay from "../components/ResponseDisplay";

const BASE_URL = "https://employee.azaken.com/api";

function Department() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deptId, setDeptId] = useState("");
  const [formData, setFormData] = useState({
    deptName: "",
    locationId: "",
    budget: "",
    managerId: "",
  });

  const handleGetAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: "/departments", data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: "/departments", error: err.message });
    }
    setLoading(false);
  };

  const handleGetById = async () => {
    if (!deptId) {
      alert("Please enter a Department ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments/${deptId}`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: `/departments/${deptId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: `/departments/${deptId}`, error: err.message });
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!formData.deptName || !formData.locationId || !formData.budget) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "POST", endpoint: "/departments", data, status: res.status });
    } catch (err) {
      setResponse({ method: "POST", endpoint: "/departments", error: err.message });
    }
    setLoading(false);
  };

  const handlePut = async () => {
    if (!deptId || !formData.deptName || !formData.locationId || !formData.budget) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments/${deptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "PUT", endpoint: `/departments/${deptId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "PUT", endpoint: `/departments/${deptId}`, error: err.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deptId) {
      alert("Please enter a Department ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/departments/${deptId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setResponse({ method: "DELETE", endpoint: `/departments/${deptId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "DELETE", endpoint: `/departments/${deptId}`, error: err.message });
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
      <h3 className=" font-bold text-[#94e2d5]">Department Control Panel</h3>

      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Department ID"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="deptName"
            placeholder="Department Name"
            value={formData.deptName}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="locationId"
            placeholder="Location ID"
            value={formData.locationId}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
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
        </div>
      </div>

      {/* API Buttons */}
      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-3">
        <button
          onClick={handleGetAll}
          disabled={loading}
          className="w-full bg-[#89dceb] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
        >
          GET - Get All Departments
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

export default Department;
