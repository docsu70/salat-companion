import { Link, useLocation } from "wouter";
import { Home, List, Menu, X, ListOrdered, BookOpen, Info } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      href: "/",
      icon: Home,
      label: "الرئيسية",
      description: "صفحة الاختيار العشوائي"
    },
    {
      href: "/list1",
      icon: List,
      label: "سور/آيات قصيرة",
      description: "إدارة السور والآيات القصيرة",
      color: "text-blue-600"
    },
    {
      href: "/list2",
      icon: ListOrdered,
      label: "سور/آيات طويلة", 
      description: "إدارة السور والآيات الطويلة",
      color: "text-green-600"
    },
    {
      href: "/list3",
      icon: BookOpen,
      label: "أيات مقترحة للحفظ",
      description: "إدارة الآيات المقترحة للحفظ",
      color: "text-purple-600"
    },
    {
      href: "/about",
      icon: Info,
      label: "حول التطبيق",
      description: "معلومات حول رفيق الصلاة",
      color: "text-gray-600"
    }
  ];

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
            <h1 className="text-base font-semibold text-gray-900">رفيق الصلاة</h1>
          </div>
          
          {/* Hamburger Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-72" dir="rtl">
              <SheetHeader className="text-right">
                <SheetTitle className="text-lg font-bold text-gray-900">
                  القائمة الرئيسية
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-colors cursor-pointer ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : "hover:bg-gray-50 text-gray-700"
                      }`}>
                        <div className={`p-2 rounded-full ${
                          isActive ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isActive ? "text-blue-600" : item.color || "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${
                            isActive ? "text-blue-900" : "text-gray-900"
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Footer info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      تطبيق اختيار السور والآيات
                    </div>
                    <div className="text-xs text-gray-600">للصلاة أو الحفظ والمراجعة</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
