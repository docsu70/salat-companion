import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { List as ListIcon, Plus, Trash2, Loader2, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackToTop } from "@/components/back-to-top";
import type { SelectionList } from "@shared/schema";

export default function List1() {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState("");
  const [deletingItems, setDeletingItems] = useState(new Set<number>());
  const deletionLockRef = useRef(new Set<string>());

  const { data: lists = [], isLoading: listsLoading } = useQuery<SelectionList[]>({
    queryKey: ["/api/lists"],
  });

  const list = lists.find(l => l.name === "سور/آيات قصيرة");

  const addItemMutation = useMutation({
    mutationFn: async (item: string) => {
      if (!list) throw new Error("List not found");
      const response = await apiRequest("POST", `/api/lists/${list.id}/items`, {
        item: item.trim(),
      });
      return await response.json();
    },
    onSuccess: (updatedList) => {
      // Force cache invalidation and immediate refetch
      queryClient.setQueryData(["/api/lists"], (prevLists: any) => {
        if (!prevLists) return prevLists;
        return prevLists.map((l: any) => 
          l.id === list?.id ? updatedList : l
        );
      });
      // Force immediate refetch to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      setNewItem("");
      toast({
        title: "أُضيف العنصر بنجاح",
        duration: 1500,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل في الإضافة",
        description: error.message || "حدث خطأ",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!list) throw new Error("List not found");
      
      const response = await apiRequest("DELETE", `/api/lists/${list.id}/items/${index}`);
      const result = await response.json();
      return result;
    },
    onSuccess: (updatedList, index) => {
      // Force cache invalidation and immediate refetch
      queryClient.setQueryData(["/api/lists"], (prevLists: any) => {
        if (!prevLists) return prevLists;
        return prevLists.map((l: any) => 
          l.id === list?.id ? updatedList : l
        );
      });
      // Force immediate refetch to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      
      const lockKey = `${list?.id}-${index}`;
      deletionLockRef.current.delete(lockKey);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      toast({
        title: "حُذف العنصر بنجاح",
        duration: 1500,
      });
    },
    onError: (error: Error, index) => {
      const lockKey = `${list?.id}-${index}`;
      deletionLockRef.current.delete(lockKey);
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      toast({
        description: error.message || "حدث خطأ في حذف العنصر",
        variant: "destructive",
      });
    },
  });

  const clearListMutation = useMutation({
    mutationFn: async () => {
      if (!list) throw new Error("List not found");
      const response = await apiRequest("DELETE", `/api/lists/${list.id}/items`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lists"] });
      queryClient.refetchQueries({ queryKey: ["/api/lists"] });
    },
    onError: (error: Error) => {
      toast({
        description: error.message || "حدث خطأ",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addItemMutation.mutate(newItem.trim());
    }
  };

  const handleRemoveItem = (index: number) => {
    if (!list) return;
    
    const lockKey = `${list.id}-${index}`;
    
    // Check if this specific item is already being deleted
    if (deletionLockRef.current.has(lockKey) || deletingItems.has(index) || removeItemMutation.isPending) {
      return;
    }
    
    // Add to both lock and state
    deletionLockRef.current.add(lockKey);
    setDeletingItems(prev => new Set(Array.from(prev).concat(index)));
    
    removeItemMutation.mutate(index);
  };

  const handleClearList = () => {
    if (list && list.items.length > 0) {
      const confirmClear = window.confirm(`هل تريد حقاً مسح جميع العناصر من "${list.name}"؟`);
      if (confirmClear) {
        clearListMutation.mutate();
      }
    }
  };

  if (listsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">القائمة غير موجودة</div>
        <div className="text-gray-500 text-sm">لم نعثر على قائمة "سور/آيات قصيرة"</div>
      </div>
    );
  }

  return (
    <>
      <BackToTop />
      <div className="space-y-6" dir="rtl">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">سور/آيات قصيرة</h2>
        <p className="text-gray-600 text-sm">خصص القائمة بإضافة أو حذف السور/الآيات </p>
      </div>

      
      
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-200">
          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="flex space-x-2 space-x-reverse">
            <Input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="أضف سور/آيات..."
              disabled={addItemMutation.isPending}
              className="flex-1 text-right"
            />
            <Button 
              type="submit"
              disabled={!newItem.trim() || addItemMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs"
            >
              {addItemMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </form>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Items List */}
          <div className="space-y-2">
            {list.items.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <div className="text-gray-500 text-sm">لا توجد عناصر في هذه القائمة بعد</div>
                <div className="text-gray-400 text-xs mt-1">ابدأ بإضافة سور أو آيات</div>
              </div>
            ) : (
              list.items.map((item, index) => {
                const isDeleting = deletingItems.has(index);
                return (
                  <div
                    key={`${index}-${item}`}
                    className={`flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100 transition-all ${
                      isDeleting ? "opacity-50 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <span className="text-gray-900 text-sm flex-1 truncate pl-2">
                      {item}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 p-1 min-w-0 disabled:opacity-30"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {list.items.length > 0 && (
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
      )}
      </div>
    </>
  );
}