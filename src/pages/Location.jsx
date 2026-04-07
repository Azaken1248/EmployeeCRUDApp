import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faDatabase,
  faList,
  faMagnifyingGlass,
  faMapLocationDot,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import ResponseDisplay from "../components/ResponseDisplay";
import { useToaster } from "../components/ToastProvider";

const BASE_URL = "https://employee.azaken.com/api";
const EMPTY_LOCATION = { city: "", state: "", country: "" };

function Location() {
  const toaster = useToaster();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [createData, setCreateData] = useState(EMPTY_LOCATION);
  const [updateData, setUpdateData] = useState(EMPTY_LOCATION);

  const parsePayload = async (res, method) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    if (!text) {
      return `${method} request completed.`;
    }
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const deriveMessage = (payload, fallbackMessage) => {
    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }

      if (typeof payload.error === "string" && payload.error.trim()) {
        return payload.error;
      }
    }

    return fallbackMessage;
  };

  const runRequest = async (method, endpoint, options = {}) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await parsePayload(res, method);
      setResponse({ method, endpoint, data, status: res.status });

      if (!res.ok) {
        toaster.error(
          deriveMessage(data, `Request failed with status ${res.status}.`),
          "Location request failed",
        );
        return;
      }

      if (method === "GET" && Array.isArray(data)) {
        toaster.success(
          `Loaded ${data.length} location record${data.length === 1 ? "" : "s"}.`,
          "Locations loaded",
        );
        return;
      }

      toaster.success(
        deriveMessage(data, `${method} location request completed successfully.`),
        "Location action complete",
      );
    } catch (err) {
      setResponse({ method, endpoint, error: err.message });
      toaster.error(err.message || "Could not connect to the location service.", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const hasRequiredFields = ({ city, state, country }) => city && state && country;

  const handleGetAll = async (event) => {
    event.preventDefault();
    await runRequest("GET", "/locations");
  };

  const handleGetById = async (event) => {
    event.preventDefault();
    if (!lookupId.trim()) {
      toaster.warning("Enter a location ID before searching.", "Location ID required");
      return;
    }
    await runRequest("GET", `/locations/${lookupId}`);
  };

  const handlePost = async (event) => {
    event.preventDefault();
    if (!hasRequiredFields(createData)) {
      toaster.warning("Fill all required fields before creating a location.", "Missing required fields");
      return;
    }
    await runRequest("POST", "/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createData),
    });
  };

  const handlePut = async (event) => {
    event.preventDefault();
    if (!updateId.trim() || !hasRequiredFields(updateData)) {
      toaster.warning("Enter the location ID and all required fields before updating.", "Update details missing");
      return;
    }
    await runRequest("PUT", `/locations/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!deleteId.trim()) {
      toaster.warning("Enter a location ID before deleting.", "Location ID required");
      return;
    }
    await runRequest("DELETE", `/locations/${deleteId}`, {
      method: "DELETE",
    });
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "bg-[#89dceb] text-[#1e1e2e]";
      case "POST":
        return "bg-[#a6e3a1] text-[#1e1e2e]";
      case "PUT":
        return "bg-[#cba6f7] text-[#1e1e2e]";
      case "DELETE":
        return "bg-[#fab387] text-[#1e1e2e]";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel-card space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#94e2d5]/20 text-[#94e2d5]">
              <FontAwesomeIcon icon={faMapLocationDot} />
            </div>
            <div className="space-y-1">
              <h2 className="panel-title text-lg text-[#94e2d5] md:text-xl">Location Workspace</h2>
              <p className="panel-description">Use dedicated forms for browsing, searching, creating, updating, or removing locations.</p>
            </div>
          </div>
          <span className="status-pill">
            <FontAwesomeIcon icon={loading ? faSpinner : faCircleInfo} className={loading ? "animate-spin" : ""} />
            {loading ? "Working on request" : "Ready to run"}
          </span>
        </div>
      </section>

      <div className="section-grid">
        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#89dceb]/20 text-[#89dceb]">
              <FontAwesomeIcon icon={faList} />
            </div>
            <div>
              <h3 className="font-bold text-[#89dceb]">Browse All Locations</h3>
              <p className="panel-description">Fetch the full location list for quick review.</p>
            </div>
          </div>
          <form onSubmit={handleGetAll}>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faDatabase} />
              Load all locations
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#89b4fa]/20 text-[#89b4fa]">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div>
              <h3 className="font-bold text-[#89b4fa]">Find Location By ID</h3>
              <p className="panel-description">Look up one location record using its unique ID.</p>
            </div>
          </div>
          <form onSubmit={handleGetById} className="space-y-3">
            <div>
              <label htmlFor="location-lookup-id" className="field-label">Location ID</label>
              <input
                id="location-lookup-id"
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="field-input"
                placeholder="Example: 12"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Find location
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a6e3a1]/20 text-[#a6e3a1]">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div>
              <h3 className="font-bold text-[#a6e3a1]">Create Location</h3>
              <p className="panel-description">Add a new location by completing all required fields.</p>
            </div>
          </div>
          <form onSubmit={handlePost} className="space-y-3">
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="create-city" className="field-label">City</label>
                <input
                  id="create-city"
                  type="text"
                  name="city"
                  value={createData.city}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="Irving"
                />
              </div>
              <div>
                <label htmlFor="create-state" className="field-label">State</label>
                <input
                  id="create-state"
                  type="text"
                  name="state"
                  value={createData.state}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="TX"
                />
              </div>
            </div>
            <div>
              <label htmlFor="create-country" className="field-label">Country</label>
              <input
                id="create-country"
                type="text"
                name="country"
                value={createData.country}
                onChange={handleCreateInputChange}
                className="field-input"
                placeholder="USA"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-post w-full">
              <FontAwesomeIcon icon={faPlus} />
              Create location
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#cba6f7]/20 text-[#cba6f7]">
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div>
              <h3 className="font-bold text-[#cba6f7]">Update Location</h3>
              <p className="panel-description">Enter the target ID and provide the new values to apply.</p>
            </div>
          </div>
          <form onSubmit={handlePut} className="space-y-3">
            <div>
              <label htmlFor="update-location-id" className="field-label">Location ID</label>
              <input
                id="update-location-id"
                type="text"
                value={updateId}
                onChange={(e) => setUpdateId(e.target.value)}
                className="field-input"
                placeholder="Example: 12"
              />
            </div>
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="update-city" className="field-label">City</label>
                <input
                  id="update-city"
                  type="text"
                  name="city"
                  value={updateData.city}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-state" className="field-label">State</label>
                <input
                  id="update-state"
                  type="text"
                  name="state"
                  value={updateData.state}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="update-country" className="field-label">Country</label>
              <input
                id="update-country"
                type="text"
                name="country"
                value={updateData.country}
                onChange={handleUpdateInputChange}
                className="field-input"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-put w-full">
              <FontAwesomeIcon icon={faPenToSquare} />
              Save location changes
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fab387]/20 text-[#fab387]">
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <div>
              <h3 className="font-bold text-[#fab387]">Delete Location</h3>
              <p className="panel-description">Remove a location record permanently by ID.</p>
            </div>
          </div>
          <form onSubmit={handleDelete} className="space-y-3">
            <div>
              <label htmlFor="delete-location-id" className="field-label">Location ID</label>
              <input
                id="delete-location-id"
                type="text"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                className="field-input"
                placeholder="Example: 12"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-delete w-full">
              <FontAwesomeIcon icon={faTrashCan} />
              Delete location
            </button>
          </form>
        </section>
      </div>

      <section className="panel-card space-y-4 p-5 md:p-6">
        <h3 className="panel-title flex items-center gap-2 text-base text-[#94e2d5] md:text-lg">
          <FontAwesomeIcon icon={faDatabase} />
          Latest API Response
        </h3>
        {response ? (
          <ResponseDisplay response={response} getMethodColor={getMethodColor} />
        ) : (
          <div className="rounded-xl border border-[#585b70] bg-[#1e1e2e]/80 p-4 text-sm text-[#bac2de]">
            Run any action form above to see your response details here.
          </div>
        )}
      </section>

      {loading && (
        <p className="flex items-center justify-center gap-2 text-[#f5e0dc]">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          Processing your request...
        </p>
      )}

      <p className="flex items-center gap-2 text-xs text-[#a6adc8]">
        <FontAwesomeIcon icon={faCircleInfo} />
        Tip: Create and update use separate forms so you can stage changes without overwriting other inputs.
      </p>
    </div>
  );
}

export default Location;
