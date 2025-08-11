import { Link, useLocation } from "wouter";
import { Home, List } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-3 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-base font-semibold text-gray-900">Random Selector</h1>
          </div>
          <nav className="flex space-x-1">
            <Link href="/">
              <button className={`nav-tab px-3 py-2 rounded-md font-medium text-xs transition-colors flex items-center ${
                location === "/" ? "active" : ""
              }`}>
                <Home className="w-3 h-3 mr-1" />
                Home
              </button>
            </Link>
            <Link href="/lists">
              <button className={`nav-tab px-3 py-2 rounded-md font-medium text-xs transition-colors flex items-center ${
                location === "/lists" ? "active" : ""
              }`}>
                <List className="w-3 h-3 mr-1" />
                Lists
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
