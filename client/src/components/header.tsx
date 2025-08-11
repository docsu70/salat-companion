import { Link, useLocation } from "wouter";
import { Home, List } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="text-primary text-2xl">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Random Selector</h1>
          </div>
          <nav className="flex space-x-1">
            <Link href="/">
              <button className={`nav-tab px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${
                location === "/" ? "active" : ""
              }`}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </Link>
            <Link href="/lists">
              <button className={`nav-tab px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${
                location === "/lists" ? "active" : ""
              }`}>
                <List className="w-4 h-4 mr-2" />
                Manage Lists
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
