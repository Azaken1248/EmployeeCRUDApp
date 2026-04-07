import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCircleInfo,
  faDatabase,
  faList,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import ResponseDisplay from "../components/ResponseDisplay";
import { useToaster } from "../components/ToastProvider";

const BASE_URL = "https://employee.azaken.com/api";
const EMPTY_DEPARTMENT = {
  deptName: "",
  locationId: "",
  budget: "",
  managerId: "",
};

function Department() {
  const toaster = useToaster();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [createData, setCreateData] = useState(EMPTY_DEPARTMENT);
  const [updateData, setUpdateData] = useState(EMPTY_DEPARTMENT);

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
          "Department request failed",
        );
        return;
      }

      if (method === "GET" && Array.isArray(data)) {
        toaster.success(
          `Loaded ${data.length} department record${data.length === 1 ? "" : "s"}.`,
          "Departments loaded",
        );
        return;
      }

      toaster.success(
        deriveMessage(data, `${method} department request completed successfully.`),
        "Department action complete",
      );
    } catch (err) {
      setResponse({ method, endpoint, error: err.message });
      toaster.error(err.message || "Could not connect to the department service.", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const hasRequiredFields = ({ deptName, locationId, budget }) => deptName && locationId && budget;

  const handleGetAll = async (event) => {
    event.preventDefault();
    await runRequest("GET", "/departments");
  };

  const handleGetById = async (event) => {
    event.preventDefault();
    if (!lookupId.trim()) {
      toaster.warning("Enter a department ID before searching.", "Department ID required");
      return;
    }
    await runRequest("GET", `/departments/${lookupId}`);
  };

  const handlePost = async (event) => {
    event.preventDefault();
    if (!hasRequiredFields(createData)) {
      toaster.warning("Fill all required fields before creating a department.", "Missing required fields");
      return;
    }
    await runRequest("POST", "/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createData),
    });
  };

  const handlePut = async (event) => {
    event.preventDefault();
    if (!updateId.trim() || !hasRequiredFields(updateData)) {
      toaster.warning("Enter the department ID and all required fields before updating.", "Update details missing");
      return;
    }
    await runRequest("PUT", `/departments/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!deleteId.trim()) {
      toaster.warning("Enter a department ID before deleting.", "Department ID required");
      return;
    }
    await runRequest("DELETE", `/departments/${deleteId}`, {
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#cba6f7]/20 text-[#cba6f7]">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <div className="space-y-1">
              <h2 className="panel-title text-lg text-[#cba6f7] md:text-xl">Department Workspace</h2>
              <p className="panel-description">Run department operations from dedicated forms for faster and safer updates.</p>
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
              <h3 className="font-bold text-[#89dceb]">Browse All Departments</h3>
              <p className="panel-description">Load all departments to review structure and assignments.</p>
            </div>
          </div>
          <form onSubmit={handleGetAll}>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faDatabase} />
              Load all departments
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#89b4fa]/20 text-[#89b4fa]">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div>
              <h3 className="font-bold text-[#89b4fa]">Find Department By ID</h3>
              <p className="panel-description">Retrieve one department record by its ID.</p>
            </div>
          </div>
          <form onSubmit={handleGetById} className="space-y-3">
            <div>
              <label htmlFor="department-lookup-id" className="field-label">Department ID</label>
              <input
                id="department-lookup-id"
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="field-input"
                placeholder="Example: 7"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Find department
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a6e3a1]/20 text-[#a6e3a1]">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div>
              <h3 className="font-bold text-[#a6e3a1]">Create Department</h3>
              <p className="panel-description">Add a department with location, budget, and manager details.</p>
            </div>
          </div>
          <form onSubmit={handlePost} className="space-y-3">
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="create-dept-name" className="field-label">Department Name</label>
                <input
                  id="create-dept-name"
                  type="text"
                  name="deptName"
                  value={createData.deptName}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="Supply Chain"
                />
              </div>
              <div>
                <label htmlFor="create-dept-location" className="field-label">Location ID</label>
                <input
                  id="create-dept-location"
                  type="text"
                  name="locationId"
                  value={createData.locationId}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="12"
                />
              </div>
              <div>
                <label htmlFor="create-dept-budget" className="field-label">Budget</label>
                <input
                  id="create-dept-budget"
                  type="text"
                  name="budget"
                  value={createData.budget}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="450000"
                />
              </div>
              <div>
                <label htmlFor="create-dept-manager" className="field-label">Manager ID (Optional)</label>
                <input
                  id="create-dept-manager"
                  type="text"
                  name="managerId"
                  value={createData.managerId}
                  onChange={handleCreateInputChange}
                  className="field-input"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="action-btn action-post w-full">
              <FontAwesomeIcon icon={faPlus} />
              Create department
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#cba6f7]/20 text-[#cba6f7]">
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div>
              <h3 className="font-bold text-[#cba6f7]">Update Department</h3>
              <p className="panel-description">Specify the target ID and submit the updated department values.</p>
            </div>
          </div>
          <form onSubmit={handlePut} className="space-y-3">
            <div>
              <label htmlFor="update-department-id" className="field-label">Department ID</label>
              <input
                id="update-department-id"
                type="text"
                value={updateId}
                onChange={(e) => setUpdateId(e.target.value)}
                className="field-input"
                placeholder="Example: 7"
              />
            </div>
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="update-dept-name" className="field-label">Department Name</label>
                <input
                  id="update-dept-name"
                  type="text"
                  name="deptName"
                  value={updateData.deptName}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-dept-location" className="field-label">Location ID</label>
                <input
                  id="update-dept-location"
                  type="text"
                  name="locationId"
                  value={updateData.locationId}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-dept-budget" className="field-label">Budget</label>
                <input
                  id="update-dept-budget"
                  type="text"
                  name="budget"
                  value={updateData.budget}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-dept-manager" className="field-label">Manager ID (Optional)</label>
                <input
                  id="update-dept-manager"
                  type="text"
                  name="managerId"
                  value={updateData.managerId}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="action-btn action-put w-full">
              <FontAwesomeIcon icon={faPenToSquare} />
              Save department changes
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fab387]/20 text-[#fab387]">
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <div>
              <h3 className="font-bold text-[#fab387]">Delete Department</h3>
              <p className="panel-description">Permanently delete a department record by ID.</p>
            </div>
          </div>
          <form onSubmit={handleDelete} className="space-y-3">
            <div>
              <label htmlFor="delete-department-id" className="field-label">Department ID</label>
              <input
                id="delete-department-id"
                type="text"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                className="field-input"
                placeholder="Example: 7"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-delete w-full">
              <FontAwesomeIcon icon={faTrashCan} />
              Delete department
            </button>
          </form>
        </section>
      </div>

      <section className="panel-card space-y-4 p-5 md:p-6">
        <h3 className="panel-title flex items-center gap-2 text-base text-[#cba6f7] md:text-lg">
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
        Tip: Use "Find Department" before updates to confirm the current record state.
      </p>
    </div>
  );
}

export default Department;
