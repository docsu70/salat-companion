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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4" dir="rtl">
      <div className="max-w-md mx-auto">
        {/* Header Card */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Dice1 className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">اختيار سور وآيات</h1>
            <p className="text-gray-600 text-sm mb-6">اختر آيات وسور للمراجعة والحفظ</p>
            
            <Button 
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg text-base w-full"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الاختيار...
                </>
              ) : (
                <>
                  <Dice1 className="ml-2 h-5 w-5" />
                  ابدأ الاختيار
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Short Verses Result */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
              <div className="flex items-center justify-center text-white">
                <ListOrdered className="ml-2 h-5 w-5" />
                <h3 className="font-semibold">سور/آيات قصيرة</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="min-h-[60px] flex items-center justify-center">
                {selections?.list1 ? (
                  <div className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200 text-center w-full">
                    {selections.list1}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">لا يوجد اختيار بعد</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Long Verses Result */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
              <div className="flex items-center justify-center text-white">
                <ListIcon className="ml-2 h-5 w-5" />
                <h3 className="font-semibold">سور/آيات طويلة</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="min-h-[60px] flex items-center justify-center">
                {selections?.list2 ? (
                  <div className="text-lg font-bold text-green-700 bg-green-50 px-4 py-3 rounded-xl border-2 border-green-200 text-center w-full">
                    {selections.list2}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">لا يوجد اختيار بعد</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
