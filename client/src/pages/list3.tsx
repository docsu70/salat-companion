import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Plus, Trash2, Loader2, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SelectionList } from "@shared/schema";

export default function List3() {
  const { toast } = useToast();
  const [input, setInput] = useState("");

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
        title: "تم إضافة العنصر",
        description: "تم إضافة العنصر إلى القائمة بنجاح.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في إضافة العنصر",
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
        title: "تم حذف العنصر",
        description: "تم حذف العنصر من القائمة بنجاح.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في حذف العنصر",
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
        title: "تم مسح القائمة",
        description: "تم حذف جميع العناصر من القائمة بنجاح.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في مسح القائمة",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const list3 = lists.find(l => l.name === "أيات مقترحة للحفظ");

  const handleAdd = () => {
    if (!input.trim() || !list3) return;
    addItemMutation.mutate({ listId: list3.id, item: input.trim() });
    setInput("");
  };

  const handleRemoveItem = (index: number) => {
    if (!list3) return;
    removeItemMutation.mutate({ listId: list3.id, index });
  };

  const handleClearList = () => {
    if (!list3) return;
    if (window.confirm(`هل أنت متأكد من أنك تريد مسح جميع العناصر من أيات مقترحة للحفظ؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      clearListMutation.mutate(list3.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
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
    <div className="space-y-4" dir="rtl">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2">أيات مقترحة للحفظ</h2>
        <p className="text-gray-600 text-sm">أضف أو احذف آيات مقترحة للحفظ</p>
      </div>

      {/* List Management */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex items-center space-x-2 space-x-reverse mb-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <BookOpen className="text-purple-600 w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">إدارة العناصر</h3>
              <p className="text-xs text-gray-500">{list3?.items.length || 0} آية</p>
            </div>
          </div>
          
          {/* Add Item Form */}
          <div className="flex space-x-2 space-x-reverse">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="أضف آية للحفظ..."
              className="flex-1 text-sm"
            />
            <Button 
              onClick={handleAdd}
              disabled={!input.trim() || addItemMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 px-3"
              size="sm"
            >
              {addItemMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>

        {/* List Items */}
        <CardContent className="p-3">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {list3?.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Inbox className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">لا توجد آيات في هذه القائمة بعد</p>
                <p className="text-xs text-gray-400 mt-1">أضف الآية الأولى باستخدام النموذج أعلاه</p>
              </div>
            ) : (
              list3?.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border">
                  <span className="text-gray-900 text-sm flex-1 truncate pl-2 leading-relaxed">{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={removeItemMutation.isPending}
                    className="text-red-500 hover:text-red-700 p-1 min-w-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {list3?.items.length ? (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-3">
            <Button 
              variant="outline"
              onClick={handleClearList}
              disabled={clearListMutation.isPending}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs p-2 h-auto w-full"
            >
              <Trash2 className="h-3 w-3 ml-1" />
              مسح جميع العناصر
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}