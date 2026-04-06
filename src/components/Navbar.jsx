import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { path: "/", label: "Location" },
        { path: "/employee", label: "Employee" },
        { path: "/department", label: "Department" },
    ];

    return (
        <div className="w-full bg-[#181825] shadow-lg">
            <div className="flex items-center justify-between p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold text-[#94e2d5]">Employee CRUD App</h1>

                <div className="hidden md:flex items-center gap-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-base md:text-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-[#94e2d5]"
                                        : "text-gray-400 hover:text-[#cdd6f4]"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
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
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `text-left px-4 py-2 rounded font-medium transition-colors ${
                                        isActive
                                            ? "bg-[#94e2d5] text-[#1e1e2e]"
                                            : "text-gray-400 hover:bg-[#45475a]"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;