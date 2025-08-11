import { Link, useLocation } from "wouter";
import { Home, List, ListOrdered } from "lucide-react";

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
            <h1 className="text-base font-semibold text-gray-900">اختيار عشوائي</h1>
          </div>
          <nav className="flex space-x-1 space-x-reverse">
            <Link href="/">
              <button className={`nav-tab px-2 py-2 rounded-md font-medium text-xs transition-colors flex items-center ${
                location === "/" ? "active" : ""
              }`}>
                <Home className="w-3 h-3 ml-1" />
                الرئيسية
              </button>
            </Link>
            <Link href="/list1">
              <button className={`nav-tab px-2 py-2 rounded-md font-medium text-xs transition-colors flex items-center ${
                location === "/list1" ? "active" : ""
              }`}>
                <ListOrdered className="w-3 h-3 ml-1" />
                القائمة 1
              </button>
            </Link>
            <Link href="/list2">
              <button className={`nav-tab px-2 py-2 rounded-md font-medium text-xs transition-colors flex items-center ${
                location === "/list2" ? "active" : ""
              }`}>
                <List className="w-3 h-3 ml-1" />
                القائمة 2
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
