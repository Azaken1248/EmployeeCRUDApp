import { useState } from "react";

function Navbar({ page, setPage }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavClick = (newPage) => {
        setPage(newPage);
        setMenuOpen(false);
    };

    return (
        <div className="w-full bg-[#181825] shadow-lg">
            <div className="flex items-center justify-between p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-[#94e2d5]">Employee CRUD App</h1>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        className={`text-base md:text-lg font-medium transition-colors ${page === "location" ? "text-[#94e2d5]" : "text-gray-400 hover:text-[#cdd6f4]"}`}
                        onClick={() => setPage("location")}
                    >
                        Location
                    </button>
                    <button
                        className={`text-base md:text-lg font-medium transition-colors ${page === "employee" ? "text-[#94e2d5]" : "text-gray-400 hover:text-[#cdd6f4]"}`}
                        onClick={() => setPage("employee")}
                    >
                        Employee
                    </button>
                    <button
                        className={`text-base md:text-lg font-medium transition-colors ${page === "department" ? "text-[#94e2d5]" : "text-gray-400 hover:text-[#cdd6f4]"}`}
                        onClick={() => setPage("department")}
                    >
                        Department
                    </button>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1 p-2 rounded hover:bg-[#313244] transition-colors"
                >
                    <div className={`w-6 h-0.5 bg-[#94e2d5] transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
                    <div className={`w-6 h-0.5 bg-[#94e2d5] transition-all ${menuOpen ? "opacity-0" : ""}`}></div>
                    <div className={`w-6 h-0.5 bg-[#94e2d5] transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-[#313244] border-t border-[#585b70]">
                    <div className="flex flex-col gap-2 p-4">
                        <button
                            className={`text-left px-4 py-2 rounded font-medium transition-colors ${page === "location" ? "bg-[#94e2d5] text-[#1e1e2e]" : "text-gray-400 hover:bg-[#45475a]"}`}
                            onClick={() => handleNavClick("location")}
                        >
                            Location
                        </button>
                        <button
                            className={`text-left px-4 py-2 rounded font-medium transition-colors ${page === "employee" ? "bg-[#94e2d5] text-[#1e1e2e]" : "text-gray-400 hover:bg-[#45475a]"}`}
                            onClick={() => handleNavClick("employee")}
                        >
                            Employee
                        </button>
                        <button
                            className={`text-left px-4 py-2 rounded font-medium transition-colors ${page === "department" ? "bg-[#94e2d5] text-[#1e1e2e]" : "text-gray-400 hover:bg-[#45475a]"}`}
                            onClick={() => handleNavClick("department")}
                        >
                            Department
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;