import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListOrdered, List as ListIcon, Plus, Trash2, Loader2, Download, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SelectionList } from "@shared/schema";

export default function Lists() {
  const { toast } = useToast();
  const [list1Input, setList1Input] = useState("");
  const [list2Input, setList2Input] = useState("");

  const { data: lists = [], isLoading } = useQuery<SelectionList[]>({
    queryKey: ["/api/lists"],
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ listId, item }: { listId: string; item: string }) => {
      const response = await apiRequest("POST", `/api/lists/${listId}/items`, { item });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      toast({
        title: "Item Added",
        description: "Item has been added to the list successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async ({ listId, index }: { listId: string; index: number }) => {
      const response = await apiRequest("DELETE", `/api/lists/${listId}/items/${index}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      toast({
        title: "Item Removed",
        description: "Item has been removed from the list successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Remove Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearListMutation = useMutation({
    mutationFn: async (listId: string) => {
      const response = await apiRequest("DELETE", `/api/lists/${listId}/items`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      toast({
        title: "List Cleared",
        description: "All items have been removed from the list successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Clear List",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const list1 = lists.find(l => l.name === "List 1");
  const list2 = lists.find(l => l.name === "List 2");

  const handleAddToList1 = () => {
    if (!list1Input.trim() || !list1) return;
    addItemMutation.mutate({ listId: list1.id, item: list1Input.trim() });
    setList1Input("");
  };

  const handleAddToList2 = () => {
    if (!list2Input.trim() || !list2) return;
    addItemMutation.mutate({ listId: list2.id, item: list2Input.trim() });
    setList2Input("");
  };

  const handleRemoveItem = (listId: string, index: number) => {
    removeItemMutation.mutate({ listId, index });
  };

  const handleClearList = (listId: string, listName: string) => {
    if (window.confirm(`Are you sure you want to clear all items from ${listName}? This action cannot be undone.`)) {
      clearListMutation.mutate(listId);
    }
  };

  const handleExportData = () => {
    const exportData = {
      list1: list1?.items || [],
      list2: list2?.items || [],
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'random-selector-lists.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your lists have been exported successfully.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter') {
      handler();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Manage Your Lists</h2>
        <p className="text-gray-600 text-lg">Add, edit, or remove items from your selection lists</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* List 1 Management */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <ListOrdered className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">List 1</h3>
                <p className="text-sm text-gray-600">Primary selection list</p>
              </div>
            </div>
            
            {/* Add Item Form */}
            <div className="flex space-x-2">
              <Input
                type="text"
                value={list1Input}
                onChange={(e) => setList1Input(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddToList1)}
                placeholder="Add new item..."
                className="flex-1"
              />
              <Button 
                onClick={handleAddToList1}
                disabled={!list1Input.trim() || addItemMutation.isPending}
                className="bg-primary hover:bg-blue-600"
              >
                {addItemMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {/* List Items */}
          <CardContent className="p-6">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {list1?.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No items in this list yet</p>
                </div>
              ) : (
                list1?.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-900">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(list1.id, index)}
                      disabled={removeItemMutation.isPending}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* List 2 Management */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <ListIcon className="text-success text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">List 2</h3>
                <p className="text-sm text-gray-600">Secondary selection list</p>
              </div>
            </div>
            
            {/* Add Item Form */}
            <div className="flex space-x-2">
              <Input
                type="text"
                value={list2Input}
                onChange={(e) => setList2Input(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddToList2)}
                placeholder="Add new item..."
                className="flex-1 focus:ring-success focus:border-transparent"
              />
              <Button 
                onClick={handleAddToList2}
                disabled={!list2Input.trim() || addItemMutation.isPending}
                className="bg-success hover:bg-green-600"
              >
                {addItemMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {/* List Items */}
          <CardContent className="p-6">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {list2?.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No items in this list yet</p>
                </div>
              ) : (
                list2?.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <span className="text-gray-900">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(list2.id, index)}
                      disabled={removeItemMutation.isPending}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card className="mt-8 shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h4>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              onClick={() => list1 && handleClearList(list1.id, "List 1")}
              disabled={clearListMutation.isPending || !list1?.items.length}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear List 1
            </Button>
            <Button 
              variant="outline"
              onClick={() => list2 && handleClearList(list2.id, "List 2")}
              disabled={clearListMutation.isPending || !list2?.items.length}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear List 2
            </Button>
            <Button 
              variant="outline"
              onClick={handleExportData}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
