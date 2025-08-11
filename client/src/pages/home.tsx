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
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Random Selections</h2>
        <p className="text-gray-600 text-lg">Click the button below to randomly select one item from each of your lists</p>
      </div>

      {/* Generate Button */}
      <div className="text-center mb-12">
        <Button 
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="bg-primary hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg text-lg h-auto"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Dice1 className="mr-3 h-5 w-5" />
              Generate Selections
            </>
          )}
        </Button>
      </div>

      {/* Results Display */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* List 1 Result */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ListOrdered className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">List 1 Selection</h3>
            <div className="min-h-[60px] flex items-center justify-center">
              {selections?.list1 ? (
                <div className="text-2xl font-bold text-primary">{selections.list1}</div>
              ) : (
                <div className="text-gray-500 italic">No selection yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List 2 Result */}
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ListIcon className="text-success text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">List 2 Selection</h3>
            <div className="min-h-[60px] flex items-center justify-center">
              {selections?.list2 ? (
                <div className="text-2xl font-bold text-success">{selections.list2}</div>
              ) : (
                <div className="text-gray-500 italic">No selection yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="mt-12 shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Lists Overview</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <ListOrdered className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">List 1 Items</p>
                <p className="text-2xl font-bold text-gray-900">{list1?.items.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-3">
                <ListIcon className="text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-600">List 2 Items</p>
                <p className="text-2xl font-bold text-gray-900">{list2?.items.length || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
