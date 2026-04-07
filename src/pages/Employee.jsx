import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faDatabase,
  faList,
  faMagnifyingGlass,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTrashCan,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import ResponseDisplay from "../components/ResponseDisplay";
import { useToaster } from "../components/ToastProvider";

const BASE_URL = "https://employee.azaken.com/api";
const EMPTY_EMPLOYEE = {
  empName: "",
  email: "",
  phone: "",
  deptId: "",
  managerId: "",
  salary: "",
  hireDate: "",
  status: "ACTIVE",
};

function Employee() {
  const toaster = useToaster();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [createData, setCreateData] = useState(EMPTY_EMPLOYEE);
  const [updateData, setUpdateData] = useState(EMPTY_EMPLOYEE);

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
          "Employee request failed",
        );
        return;
      }

      if (method === "GET" && Array.isArray(data)) {
        toaster.success(
          `Loaded ${data.length} employee record${data.length === 1 ? "" : "s"}.`,
          "Employees loaded",
        );
        return;
      }

      toaster.success(
        deriveMessage(data, `${method} employee request completed successfully.`),
        "Employee action complete",
      );
    } catch (err) {
      setResponse({ method, endpoint, error: err.message });
      toaster.error(err.message || "Could not connect to the employee service.", "Network error");
    } finally {
      setLoading(false);
    }
  };

  const hasRequiredFields = ({ empName, email, phone, deptId, salary }) =>
    empName && email && phone && deptId && salary;

  const handleGetAll = async (event) => {
    event.preventDefault();
    await runRequest("GET", "/employees");
  };

  const handleGetById = async (event) => {
    event.preventDefault();
    if (!lookupId.trim()) {
      toaster.warning("Enter an employee ID before searching.", "Employee ID required");
      return;
    }

    await runRequest("GET", `/employees/${lookupId}`);
  };

  const handlePost = async (event) => {
    event.preventDefault();
    if (!hasRequiredFields(createData)) {
      toaster.warning("Fill all required fields before creating an employee.", "Missing required fields");
      return;
    }

    await runRequest("POST", "/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createData),
    });
  };

  const handlePut = async (event) => {
    event.preventDefault();
    if (!updateId.trim() || !hasRequiredFields(updateData)) {
      toaster.warning("Enter the employee ID and all required fields before updating.", "Update details missing");
      return;
    }

    await runRequest("PUT", `/employees/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!deleteId.trim()) {
      toaster.warning("Enter an employee ID before deleting.", "Employee ID required");
      return;
    }

    await runRequest("DELETE", `/employees/${deleteId}`, {
      method: "DELETE",
    });
  };

  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (event) => {
    const { name, value } = event.target;
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
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#89b4fa]/20 text-[#89b4fa]">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="space-y-1">
              <h2 className="panel-title text-lg text-[#89b4fa] md:text-xl">Employee Workspace</h2>
              <p className="panel-description">Each action has its own form so daily operations are cleaner and less error-prone.</p>
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
              <h3 className="font-bold text-[#89dceb]">Browse All Employees</h3>
              <p className="panel-description">Load every employee record for a complete list view.</p>
            </div>
          </div>
          <form onSubmit={handleGetAll}>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faDatabase} />
              Load all employees
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#89b4fa]/20 text-[#89b4fa]">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div>
              <h3 className="font-bold text-[#89b4fa]">Find Employee By ID</h3>
              <p className="panel-description">Fetch one employee profile by entering an employee ID.</p>
            </div>
          </div>
          <form onSubmit={handleGetById} className="space-y-3">
            <div>
              <label htmlFor="employee-lookup-id" className="field-label">Employee ID</label>
              <input
                id="employee-lookup-id"
                type="text"
                value={lookupId}
                onChange={(event) => setLookupId(event.target.value)}
                className="field-input"
                placeholder="Example: 105"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-get w-full">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Find employee
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a6e3a1]/20 text-[#a6e3a1]">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div>
              <h3 className="font-bold text-[#a6e3a1]">Create Employee</h3>
              <p className="panel-description">Add a new employee with required profile and job details.</p>
            </div>
          </div>
          <form onSubmit={handlePost} className="space-y-3">
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="create-emp-name" className="field-label">Employee Name</label>
                <input
                  id="create-emp-name"
                  type="text"
                  name="empName"
                  value={createData.empName}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="Taylor Johnson"
                />
              </div>
              <div>
                <label htmlFor="create-emp-email" className="field-label">Email</label>
                <input
                  id="create-emp-email"
                  type="email"
                  name="email"
                  value={createData.email}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="taylor@company.com"
                />
              </div>
              <div>
                <label htmlFor="create-emp-phone" className="field-label">Phone</label>
                <input
                  id="create-emp-phone"
                  type="text"
                  name="phone"
                  value={createData.phone}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label htmlFor="create-emp-dept" className="field-label">Department ID</label>
                <input
                  id="create-emp-dept"
                  type="text"
                  name="deptId"
                  value={createData.deptId}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="3"
                />
              </div>
              <div>
                <label htmlFor="create-emp-manager" className="field-label">Manager ID (Optional)</label>
                <input
                  id="create-emp-manager"
                  type="text"
                  name="managerId"
                  value={createData.managerId}
                  onChange={handleCreateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="create-emp-salary" className="field-label">Salary</label>
                <input
                  id="create-emp-salary"
                  type="text"
                  name="salary"
                  value={createData.salary}
                  onChange={handleCreateInputChange}
                  className="field-input"
                  placeholder="65000"
                />
              </div>
              <div>
                <label htmlFor="create-emp-hire-date" className="field-label">Hire Date</label>
                <input
                  id="create-emp-hire-date"
                  type="date"
                  name="hireDate"
                  value={createData.hireDate}
                  onChange={handleCreateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="create-emp-status" className="field-label">Status</label>
                <select
                  id="create-emp-status"
                  name="status"
                  value={createData.status}
                  onChange={handleCreateInputChange}
                  className="field-input"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="action-btn action-post w-full">
              <FontAwesomeIcon icon={faPlus} />
              Create employee
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#cba6f7]/20 text-[#cba6f7]">
              <FontAwesomeIcon icon={faPenToSquare} />
            </div>
            <div>
              <h3 className="font-bold text-[#cba6f7]">Update Employee</h3>
              <p className="panel-description">Set the employee ID, then enter the updated profile values.</p>
            </div>
          </div>
          <form onSubmit={handlePut} className="space-y-3">
            <div>
              <label htmlFor="update-employee-id" className="field-label">Employee ID</label>
              <input
                id="update-employee-id"
                type="text"
                value={updateId}
                onChange={(event) => setUpdateId(event.target.value)}
                className="field-input"
                placeholder="Example: 105"
              />
            </div>
            <div className="field-grid two-columns">
              <div>
                <label htmlFor="update-emp-name" className="field-label">Employee Name</label>
                <input
                  id="update-emp-name"
                  type="text"
                  name="empName"
                  value={updateData.empName}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-email" className="field-label">Email</label>
                <input
                  id="update-emp-email"
                  type="email"
                  name="email"
                  value={updateData.email}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-phone" className="field-label">Phone</label>
                <input
                  id="update-emp-phone"
                  type="text"
                  name="phone"
                  value={updateData.phone}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-dept" className="field-label">Department ID</label>
                <input
                  id="update-emp-dept"
                  type="text"
                  name="deptId"
                  value={updateData.deptId}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-manager" className="field-label">Manager ID (Optional)</label>
                <input
                  id="update-emp-manager"
                  type="text"
                  name="managerId"
                  value={updateData.managerId}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-salary" className="field-label">Salary</label>
                <input
                  id="update-emp-salary"
                  type="text"
                  name="salary"
                  value={updateData.salary}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-hire-date" className="field-label">Hire Date</label>
                <input
                  id="update-emp-hire-date"
                  type="date"
                  name="hireDate"
                  value={updateData.hireDate}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="update-emp-status" className="field-label">Status</label>
                <select
                  id="update-emp-status"
                  name="status"
                  value={updateData.status}
                  onChange={handleUpdateInputChange}
                  className="field-input"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="action-btn action-put w-full">
              <FontAwesomeIcon icon={faPenToSquare} />
              Save employee changes
            </button>
          </form>
        </section>

        <section className="panel-card space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fab387]/20 text-[#fab387]">
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <div>
              <h3 className="font-bold text-[#fab387]">Delete Employee</h3>
              <p className="panel-description">Delete one employee record by ID.</p>
            </div>
          </div>
          <form onSubmit={handleDelete} className="space-y-3">
            <div>
              <label htmlFor="delete-employee-id" className="field-label">Employee ID</label>
              <input
                id="delete-employee-id"
                type="text"
                value={deleteId}
                onChange={(event) => setDeleteId(event.target.value)}
                className="field-input"
                placeholder="Example: 105"
              />
            </div>
            <button type="submit" disabled={loading} className="action-btn action-delete w-full">
              <FontAwesomeIcon icon={faTrashCan} />
              Delete employee
            </button>
          </form>
        </section>
      </div>

      <section className="panel-card space-y-4 p-5 md:p-6">
        <h3 className="panel-title flex items-center gap-2 text-base text-[#89b4fa] md:text-lg">
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
        Tip: Keep "Find" and "Update" IDs separate so you can validate a record first, then edit confidently.
      </p>
    </div>
  );
}

export default Employee;
