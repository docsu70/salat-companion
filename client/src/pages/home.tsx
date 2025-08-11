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
        title: "Selections Generated!",
        description: "New random selections have been generated from your lists.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate selections. Please ensure both lists have items.",
        variant: "destructive",
      });
    },
  });

  const list1 = lists.find(l => l.name === "List 1");
  const list2 = lists.find(l => l.name === "List 2");

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
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Generate Random Selections</h2>
        <p className="text-gray-600 text-sm">Tap the button to select from your lists</p>
      </div>

      {/* Generate Button */}
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-sm w-full max-w-xs"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Dice1 className="mr-2 h-4 w-4" />
              Generate Selections
            </>
          )}
        </Button>
      </div>

      {/* Results Display */}
      <div className="space-y-3">
        {/* List 1 Result */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="bg-blue-50 rounded-full p-2 w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <ListOrdered className="text-primary text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">List 1</h3>
            <div className="min-h-[40px] flex items-center justify-center">
              {selections?.list1 ? (
                <div className="text-base font-bold text-primary px-2 py-1 bg-blue-50 rounded">{selections.list1}</div>
              ) : (
                <div className="text-gray-400 text-xs">No selection yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List 2 Result */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="bg-green-50 rounded-full p-2 w-8 h-8 mx-auto mb-2 flex items-center justify-center">
              <ListIcon className="text-success text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">List 2</h3>
            <div className="min-h-[40px] flex items-center justify-center">
              {selections?.list2 ? (
                <div className="text-base font-bold text-success px-2 py-1 bg-green-50 rounded">{selections.list2}</div>
              ) : (
                <div className="text-gray-400 text-xs">No selection yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="mt-6 shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Your Lists</h4>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-2 inline-block mb-1">
                <ListOrdered className="text-primary w-3 h-3" />
              </div>
              <p className="text-xs text-gray-600">List 1</p>
              <p className="text-lg font-bold text-gray-900">{list1?.items.length || 0}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-2 inline-block mb-1">
                <ListIcon className="text-success w-3 h-3" />
              </div>
              <p className="text-xs text-gray-600">List 2</p>
              <p className="text-lg font-bold text-gray-900">{list2?.items.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
