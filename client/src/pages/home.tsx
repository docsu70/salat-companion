import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dice1, ListOrdered, List as ListIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SelectionList } from "@shared/schema";

interface SelectionResult {
  list1: string;
  list2: string;
}

export default function Home() {
  const { toast } = useToast();
  const [selections, setSelections] = useState<SelectionResult | null>(null);

  const { data: lists = [], isLoading: listsLoading } = useQuery<SelectionList[]>({
    queryKey: ["/api/lists"],
  });

  const generateMutation = useMutation({
    mutationFn: async (): Promise<SelectionResult> => {
      const response = await apiRequest("POST", "/api/generate-selections");
      return await response.json();
    },
    onSuccess: (data) => {
      setSelections(data);
      toast({
        title: "تم إنشاء الاختيارات!",
        description: "تم إنشاء اختيارات عشوائية جديدة من قوائمك.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في الإنشاء",
        description: error.message || "فشل في إنشاء الاختيارات. تأكد من أن كلا القائمتين تحتوي على عناصر.",
        variant: "destructive",
      });
    },
  });

  const list1 = lists.find(l => l.name === "سور/آيات قصيرة");
  const list2 = lists.find(l => l.name === "سور/آيات طويلة");

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  if (listsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-4 space-y-6" dir="rtl">
      {/* Simple Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">اختيار عشوائي</h1>
        <p className="text-gray-500 text-sm">للسور والآيات</p>
      </div>

      {/* Central Generate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          size="lg"
          className="w-32 h-32 rounded-full bg-white border-4 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="text-center">
            {generateMutation.isPending ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin mb-1" />
            ) : (
              <Dice1 className="mx-auto h-8 w-8 mb-1" />
            )}
            <div className="text-xs font-semibold">
              {generateMutation.isPending ? "جاري..." : "اختر"}
            </div>
          </div>
        </Button>
      </div>

      {/* Results in Two Columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* Short Verses */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-blue-600">
            <ListOrdered className="h-4 w-4" />
            <span className="text-xs font-medium">قصيرة</span>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-lg p-3 min-h-[80px] flex items-center justify-center">
            {selections?.list1 ? (
              <div className="text-center">
                <div className="text-blue-800 font-bold text-sm leading-relaxed">
                  {selections.list1}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-xs text-center">
                لا يوجد اختيار
              </div>
            )}
          </div>
        </div>

        {/* Long Verses */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-green-600">
            <ListIcon className="h-4 w-4" />
            <span className="text-xs font-medium">طويلة</span>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-lg p-3 min-h-[80px] flex items-center justify-center">
            {selections?.list2 ? (
              <div className="text-center">
                <div className="text-green-800 font-bold text-sm leading-relaxed">
                  {selections.list2}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-xs text-center">
                لا يوجد اختيار
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{list1?.items.length || 0}</div>
            <div className="text-xs text-gray-600">سور قصيرة</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{list2?.items.length || 0}</div>
            <div className="text-xs text-gray-600">سور طويلة</div>
          </div>
        </div>
      </div>
    </div>
  );
}
