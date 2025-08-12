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
  list3: string;
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
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في الإنشاء",
        description: error.message || "حدث خطأ",
        variant: "destructive",
      });
    },
  });

  const list1 = lists.find(l => l.name === "سور/آيات قصيرة");
  const list2 = lists.find(l => l.name === "سور/آيات طويلة");
  const list3 = lists.find(l => l.name === "أيات مقترحة للحفظ");

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
    <div className="space-y-4" dir="rtl">
      <div className="text-center mb-4">
        <p className="text-gray-600 text-sm">اضغط على الزر لاختيار سور وآيات عشوائية من قوائمك</p>
      </div>
      {/* Generate Button */}
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-sm w-[60%] bg-[#004d66] mt-[0px] mb-[0px]"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الإنشاء...
            </>
          ) : (
            <>
              <Dice1 className="ml-2 h-4 w-4" />
              اختيار جديد
            </>
          )}
        </Button>
      </div>
      {/* Results Display */}
      <div className="space-y-3">
        {/* List 1 Result */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 text-center bg-[#d3ded8]">
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2">سور/آيات قصيرة</h3>
            <div className="min-h-[40px] flex items-center justify-center bg-[white] text-[black]">
              {selections?.list1 ? (
                <div className="text-base font-bold text-primary px-2 py-1 bg-blue-50 rounded">{selections.list1}</div>
              ) : (
                <div className="text-gray-400 text-xs">لا يوجد اختيار بعد</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List 2 Result */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 text-center bg-[#d3ded8]">
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2">سور/آيات طويلة</h3>
            <div className="min-h-[40px] flex items-center justify-center bg-[white] text-[black]">
              {selections?.list2 ? (
                <div className="text-base font-bold text-success px-2 py-1 bg-green-50 rounded">{selections.list2}</div>
              ) : (
                <div className="text-gray-400 text-xs">لا يوجد اختيار بعد</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List 3 Result */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 text-center bg-[#d3ded8]">
            
            <h3 className="text-sm font-semibold text-gray-900 mb-2">أيات مقترحة للحفظ</h3>
            <div className="min-h-[40px] flex items-center justify-center bg-[white] text-[black]">
              {selections?.list3 ? (
                <div className="text-base font-bold px-2 py-1 rounded bg-[transparent] text-[black]" style={{ color: '#7c3aed' }}>{selections.list3}</div>
              ) : (
                <div className="text-gray-400 text-xs">لا يوجد اختيار بعد</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
