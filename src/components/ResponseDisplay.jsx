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
  if (!response) return null;

  const isArray = Array.isArray(response.data);
  const isError = response.error;

  const getAllKeys = (arr) => {
    const keysSet = new Set();
    arr.forEach(item => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach(key => keysSet.add(key));
      }
    });
    return Array.from(keysSet);
  };

  return (
    <div className="bg-[#313244] p-3 md:p-6 rounded-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 pb-3 border-b border-[#585b70]">
        <span className={`${getMethodColor(response.method)} px-3 py-1 rounded font-bold text-xs md:text-sm`}>
          {response.method}
        </span>
        <span className="text-[#94e2d5] font-mono text-xs md:text-sm">{response.endpoint}</span>
        {response.status && <span className="text-[#a6e3a1] text-xs md:text-sm">Status: {response.status}</span>}
      </div>

      {isError && (
        <div className="bg-[#f5c2b0] bg-opacity-20 border border-[#f5c2b0] rounded p-4 text-[#f5c2b0]">
          <p className="font-bold">Error:</p>
          <p className="text-sm">{response.error}</p>
        </div>
      )}

      {isArray && response.data && response.data.length > 0 && (
        <div className="space-y-3 overflow-x-auto">
          <p className="text-[#94e2d5] font-bold text-sm">Records ({response.data.length})</p>
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="bg-[#1e1e2e] border-b-2 border-[#585b70]">
                {getAllKeys(response.data).map((key) => (
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
              {response.data.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#45475a] hover:bg-[#1e1e2e] transition-colors"
                >
                  {getAllKeys(response.data).map((key) => (
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

      {/* Empty Array */}
      {isArray && response.data && response.data.length === 0 && (
        <div className="bg-[#1e1e2e] border border-[#585b70] rounded p-4 text-center text-[#b4befe]">
          No data available
        </div>
      )}

      {/* Success Message for POST/PUT/DELETE */}
      {!isArray && typeof response.data === "string" && (
        <div className="bg-[#a6e3a1] bg-opacity-20 border border-[#a6e3a1] rounded p-4 text-[#a6e3a1] text-sm md:text-base">
          {response.data}
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
