import React, { useState } from "react";
import ResponseDisplay from "../components/ResponseDisplay";

const BASE_URL = "https://employee.azaken.com/api";

function Location() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locId, setLocId] = useState("");
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const handleGetAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/locations`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: "/locations", data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: "/locations", error: err.message });
    }
    setLoading(false);
  };

  const handleGetById = async () => {
    if (!locId) {
      alert("Please enter a Location ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/locations/${locId}`);
      const data = await res.json();
      setResponse({ method: "GET", endpoint: `/locations/${locId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "GET", endpoint: `/locations/${locId}`, error: err.message });
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!formData.city || !formData.state || !formData.country) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "POST", endpoint: "/locations", data, status: res.status });
    } catch (err) {
      setResponse({ method: "POST", endpoint: "/locations", error: err.message });
    }
    setLoading(false);
  };

  const handlePut = async () => {
    if (!locId || !formData.city || !formData.state || !formData.country) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/locations/${locId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponse({ method: "PUT", endpoint: `/locations/${locId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "PUT", endpoint: `/locations/${locId}`, error: err.message });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!locId) {
      alert("Please enter a Location ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/locations/${locId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setResponse({ method: "DELETE", endpoint: `/locations/${locId}`, data, status: res.status });
    } catch (err) {
      setResponse({ method: "DELETE", endpoint: `/locations/${locId}`, error: err.message });
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
      <h3 className="font-bold text-[#94e2d5]">Location Control Panel</h3>

      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Location ID"
            value={locId}
            onChange={(e) => setLocId(e.target.value)}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleInputChange}
            className="bg-[#45475a] text-[#cdd6f4] p-2 rounded border border-[#585b70] focus:outline-none focus:border-[#94e2d5]"
          />
        </div>
      </div>

      <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-3">
        <button
          onClick={handleGetAll}
          disabled={loading}
          className="w-full bg-[#89dceb] text-[#1e1e2e] font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 text-sm md:text-base"
        >
          GET - Get All Locations
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

export default Location;
