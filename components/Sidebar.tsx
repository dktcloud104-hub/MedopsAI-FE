"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onAddPatient: () => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, onAddPatient }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/patients") {
      return pathname === path || pathname?.startsWith("/patient/");
    }
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto z-50 transition-all duration-300 shadow-sm ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "w-64 lg:w-20" : "w-64"}`}
    >
      <div className={`p-4 sm:p-6 pb-24`}>
        <div className={`flex items-center mb-8 ${isCollapsed ? "justify-center flex-col gap-4" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-lg flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">MediCare</h2>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 items-center justify-center p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => setSidebarOpen(false)} className={`lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${isCollapsed ? 'hidden' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            title={isCollapsed ? "Dashboard" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-lg font-medium transition-colors ${isActive("/dashboard")
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {!isCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handleNavigation("/patients")}
            title={isCollapsed ? "Patients" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-lg font-medium transition-colors ${isActive("/patients")
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {!isCollapsed && <span>Patients</span>}
          </button>

          <button
            onClick={() => handleNavigation("/appointments")}
            title={isCollapsed ? "Patient Timeline" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 rounded-lg font-medium transition-colors ${isActive("/appointments")
                ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {!isCollapsed && <span>Patient Timeline</span>}
          </button>
        </nav>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
        <button
          onClick={() => {
            onAddPatient();
            setSidebarOpen(false);
          }}
          title={isCollapsed ? "Add Patient" : undefined}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${isCollapsed ? "p-3" : "px-4 py-3"} rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {!isCollapsed && <span className="whitespace-nowrap">Add Patient</span>}
        </button>
      </div>
    </aside>
  );
}
