import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 left-6 z-50 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="العودة إلى الأعلى"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}