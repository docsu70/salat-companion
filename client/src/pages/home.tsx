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
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        {/* Top Dashboard Card */}
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">لوحة الاختيار</h1>
                <p className="text-xs text-gray-500">السور والآيات القرآنية</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Dice1 className="text-blue-600 h-5 w-5" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{list1?.items.length || 0}</div>
                <div className="text-xs text-blue-800">سور قصيرة</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-600">{list2?.items.length || 0}</div>
                <div className="text-xs text-green-800">سور طويلة</div>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الاختيار...
                </>
              ) : (
                <>
                  <Dice1 className="ml-2 h-4 w-4" />
                  بدء الاختيار العشوائي
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Cards Stack */}
        <div className="space-y-3">
          {/* Short Verses Card */}
          <Card className="bg-white shadow-sm border-r-4 border-r-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ListOrdered className="text-blue-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">سور/آيات قصيرة</h3>
                  <p className="text-xs text-gray-500">للمراجعة السريعة</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                {selections?.list1 ? (
                  <div className="text-center">
                    <div className="text-blue-900 font-bold text-base mb-1">{selections.list1}</div>
                    <div className="text-blue-600 text-xs">تم الاختيار</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">في انتظار الاختيار</div>
                    <div className="text-gray-300 text-xs">اضغط الزر أعلاه</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Long Verses Card */}
          <Card className="bg-white shadow-sm border-r-4 border-r-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ListIcon className="text-green-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">سور/آيات طويلة</h3>
                  <p className="text-xs text-gray-500">للحفظ والتدبر</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
                {selections?.list2 ? (
                  <div className="text-center">
                    <div className="text-green-900 font-bold text-base mb-1">{selections.list2}</div>
                    <div className="text-green-600 text-xs">تم الاختيار</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">في انتظار الاختيار</div>
                    <div className="text-gray-300 text-xs">اضغط الزر أعلاه</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-sm border-0">
          <CardContent className="p-3 text-center">
            <div className="text-sm font-semibold mb-1">نصيحة</div>
            <div className="text-xs opacity-90">
              استخدم هذا التطبيق يومياً لمراجعة السور والآيات بشكل منتظم
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
