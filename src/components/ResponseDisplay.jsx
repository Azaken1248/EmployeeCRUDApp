import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faClipboardList,
  faMagnifyingGlass,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

const getValueColor = (value) => {
  if (value === null) return "text-[#f5c2b0]";
  if (typeof value === "boolean") return "text-[#f38ba8]";
  if (typeof value === "number") return "text-[#a6e3a1]";
  if (typeof value === "string") return "text-[#89dceb]";
  return "text-[#cdd6f4]";
};

const formatValue = (value) => {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const ResponseDisplay = ({ response, getMethodColor }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
  }, [response]);

  if (!response) return null;

  const isArray = Array.isArray(response.data);
  const isError = response.error;

  const getAllKeys = (arr) => {
    const keysSet = new Set();
    arr.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((key) => keysSet.add(key));
      }
    });
    return Array.from(keysSet);
  };

  const arrayKeys = useMemo(() => {
    if (!isArray || !response.data) return [];
    return getAllKeys(response.data);
  }, [isArray, response.data]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!isArray || !response.data) return [];
    if (!normalizedSearchTerm) return response.data;

    return response.data.filter((row) => {
      if (row && typeof row === "object") {
        return arrayKeys.some((key) => {
          const value = row[key];
          if (value === null || value === undefined) return false;
          if (typeof value === "object") {
            return JSON.stringify(value).toLowerCase().includes(normalizedSearchTerm);
          }
          return String(value).toLowerCase().includes(normalizedSearchTerm);
        });
      }

      return String(row ?? "").toLowerCase().includes(normalizedSearchTerm);
    });
  }, [isArray, response.data, normalizedSearchTerm, arrayKeys]);

  return (
    <div className="bg-[#1e1e2e]/70 p-3 md:p-6 rounded-xl border border-[#585b70] space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 pb-3 border-b border-[#585b70]">
        <span className={`${getMethodColor(response.method)} px-3 py-1 rounded font-bold text-xs md:text-sm`}>
          {response.method}
        </span>
        <span className="text-[#94e2d5] font-mono text-xs md:text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faClipboardList} />
          {response.endpoint}
        </span>
        {response.status && (
          <span className="text-[#a6e3a1] text-xs md:text-sm">Status: {response.status}</span>
        )}
      </div>

      {isError && (
        <div className="bg-[#f5c2b0] bg-opacity-20 border border-[#f5c2b0] rounded p-4 text-[#f5c2b0]">
          <p className="font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faCircleExclamation} />
            Error
          </p>
          <p className="text-sm">{response.error}</p>
        </div>
      )}

      {isArray && response.data && response.data.length > 0 && (
        <div className="space-y-3 overflow-x-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[#94e2d5] font-bold text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faTableList} />
              Records ({filteredRows.length} of {response.data.length})
            </p>
            <div className="w-full sm:w-80">
              <label htmlFor="super-search" className="sr-only">Super search table records</label>
              <div className="flex items-center gap-2 rounded-lg border border-[#585b70] bg-[#313244] px-3 py-2">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#89dceb]" />
                <input
                  id="super-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Super search any table value"
                  className="w-full bg-transparent text-[#cdd6f4] placeholder-[#7f849c] text-xs md:text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {filteredRows.length > 0 ? (
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e1e2e] border-b-2 border-[#585b70]">
                  {arrayKeys.map((key) => (
                    <th
                      key={key}
                      className="text-left px-3 md:px-4 py-2 text-[#94e2d5] font-bold whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#45475a] hover:bg-[#1e1e2e] transition-colors"
                  >
                    {arrayKeys.map((key) => (
                      <td
                        key={`${idx}-${key}`}
                        className={`px-3 md:px-4 py-2 ${getValueColor(item[key])} whitespace-nowrap truncate max-w-xs md:max-w-sm`}
                      >
                        {formatValue(item[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-[#1e1e2e] border border-[#585b70] rounded p-4 text-center text-[#b4befe]">
              No matching records for "{searchTerm}".
            </div>
          )}
        </div>
      )}

      {!isArray && response.data && typeof response.data === "object" && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <tbody>
              {Object.entries(response.data).map(([key, value]) => (
                <tr key={key} className="border-b border-[#45475a] hover:bg-[#1e1e2e] transition-colors">
                  <td className="px-3 md:px-4 py-2 text-[#94e2d5] font-bold whitespace-nowrap bg-[#1e1e2e]">
                    {key}
                  </td>
                  <td
                    className={`px-3 md:px-4 py-2 ${getValueColor(value)} text-right whitespace-normal wrap-break-word`}
                  >
                    {typeof value === "object" ? JSON.stringify(value) : formatValue(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isArray && response.data && response.data.length === 0 && (
        <div className="bg-[#1e1e2e] border border-[#585b70] rounded p-4 text-center text-[#b4befe]">
          No data available
        </div>
      )}

      {!isArray && typeof response.data === "string" && (
        <div className="bg-[#a6e3a1] bg-opacity-20 border border-[#a6e3a1] rounded p-4 text-[#a6e3a1] text-sm md:text-base">
          <span className="mr-2">
            <FontAwesomeIcon icon={faCircleCheck} />
          </span>
          {response.data}
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
