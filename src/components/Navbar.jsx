import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBuilding,
    faGaugeHigh,
    faLocationDot,
    faUsers,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { path: "/location", label: "Locations", icon: faLocationDot },
        { path: "/employee", label: "Employees", icon: faUsers },
        { path: "/department", label: "Departments", icon: faBuilding },
    ];

    return (
        <header className="sticky top-0 z-30 border-b border-[#45475a] bg-[#181825]/90 backdrop-blur-xl">
            <div className="mx-auto flex w-[min(1240px,calc(100%-2rem))] items-center justify-between gap-4 py-4">
                <NavLink
                    to="/location"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-[#45475a] bg-[#313244]/70 px-4 py-2 text-[#cdd6f4]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#89b4fa] text-[#1e1e2e]">
                        <FontAwesomeIcon icon={faGaugeHigh} />
                    </span>
                    <span>
                        <span className="block text-xs uppercase tracking-[0.2em] text-[#a6adc8]">Control Panel</span>
                        <span className="block text-sm font-bold md:text-base">Employee Operations</span>
                    </span>
                </NavLink>

                <nav className="hidden items-center gap-2 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${
                                    isActive
                                        ? "border-[#94e2d5] bg-[#94e2d5]/20 text-[#94e2d5]"
                                        : "border-[#45475a] bg-[#313244]/60 text-[#bac2de] hover:border-[#6c7086] hover:text-[#cdd6f4]"
                                }`
                            }
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#45475a] bg-[#313244] text-[#94e2d5] md:hidden"
                    aria-label="Toggle navigation"
                >
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-[#45475a] bg-[#1e1e2e] md:hidden">
                    <div className="mx-auto flex w-[min(1240px,calc(100%-2rem))] flex-col gap-2 py-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `inline-flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold ${
                                        isActive
                                            ? "border-[#94e2d5] bg-[#94e2d5]/20 text-[#94e2d5]"
                                            : "border-[#45475a] bg-[#313244]/60 text-[#bac2de]"
                                    }`
                                }
                            >
                                <FontAwesomeIcon icon={item.icon} />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;