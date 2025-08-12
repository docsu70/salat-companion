import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListOrdered, List as ListIcon, BookOpen, Plus, Trash2, Loader2, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SelectionList } from "@shared/schema";

export default function AllLists() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<Record<string, string>>({});

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

  const handleAdd = (listId: string) => {
    const input = inputs[listId] || "";
    if (!input.trim()) return;
    addItemMutation.mutate({ listId, item: input.trim() });
    setInputs({ ...inputs, [listId]: "" });
  };

  const handleRemoveItem = (listId: string, index: number) => {
    removeItemMutation.mutate({ listId, index });
  };

  const handleClearList = (listId: string, listName: string) => {
    if (window.confirm(`هل أنت متأكد من أنك تريد مسح جميع العناصر من ${listName}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      clearListMutation.mutate(listId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, listId: string) => {
    if (e.key === 'Enter') {
      handleAdd(listId);
    }
  };

  const getListIcon = (listName: string) => {
    if (listName === "سور/آيات قصيرة") return <ListOrdered className="w-4 h-4" />;
    if (listName === "سور/آيات طويلة") return <ListIcon className="w-4 h-4" />;
    if (listName === "أيات مقترحة للحفظ") return <BookOpen className="w-4 h-4" />;
    return <ListIcon className="w-4 h-4" />;
  };

  const getListColor = (listName: string) => {
    if (listName === "سور/آيات قصيرة") return "blue";
    if (listName === "سور/آيات طويلة") return "green";
    if (listName === "أيات مقترحة للحفظ") return "purple";
    return "gray";
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
        <h2 className="text-lg font-bold text-gray-900 mb-2">إدارة القوائم</h2>
        <p className="text-gray-600 text-sm">أضف أو احذف عناصر من قوائمك</p>
      </div>

      <Tabs defaultValue="list-1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {lists.map((list) => {
            const color = getListColor(list.name);
            return (
              <TabsTrigger 
                key={list.id} 
                value={list.id}
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className="flex items-center space-x-1 space-x-reverse">
                  {getListIcon(list.name)}
                  <span className="truncate max-w-20">{list.name}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {lists.map((list) => {
          const color = getListColor(list.name);
          const colorClasses = {
            blue: { bg: "bg-blue-100", text: "text-primary", button: "bg-primary hover:bg-blue-600", item: "bg-blue-50" },
            green: { bg: "bg-green-100", text: "text-success", button: "bg-success hover:bg-green-600", item: "bg-green-50" },
            purple: { bg: "bg-purple-100", text: "text-purple-600", button: "bg-purple-600 hover:bg-purple-700", item: "bg-purple-50" },
            gray: { bg: "bg-gray-100", text: "text-gray-600", button: "bg-gray-600 hover:bg-gray-700", item: "bg-gray-50" }
          };
          const colors = colorClasses[color as keyof typeof colorClasses];

          return (
            <TabsContent key={list.id} value={list.id} className="mt-4">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <div className={`${colors.bg} rounded-lg p-2`}>
                      <div className={colors.text}>
                        {getListIcon(list.name)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">إدارة العناصر</h3>
                      <p className="text-xs text-gray-500">
                        {list.items.length} {list.name === "أيات مقترحة للحفظ" ? "آية" : "سورة/آية"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Add Item Form */}
                  <div className="flex space-x-2 space-x-reverse">
                    <Input
                      type="text"
                      value={inputs[list.id] || ""}
                      onChange={(e) => setInputs({ ...inputs, [list.id]: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, list.id)}
                      placeholder={
                        list.name === "أيات مقترحة للحفظ" 
                          ? "أضف آية للحفظ..." 
                          : list.name === "سور/آيات قصيرة"
                          ? "أضف سورة أو آية قصيرة..."
                          : list.name === "سور/آيات طويلة"
                          ? "أضف سورة أو آية طويلة..."
                          : "أضف عنصر جديد..."
                      }
                      className="flex-1 text-sm"
                    />
                    <Button 
                      onClick={() => handleAdd(list.id)}
                      disabled={!inputs[list.id]?.trim() || addItemMutation.isPending}
                      className={`${colors.button} px-3`}
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
                    {list.items.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Inbox className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm">لا توجد عناصر في هذه القائمة بعد</p>
                        <p className="text-xs text-gray-400 mt-1">أضف العنصر الأول باستخدام النموذج أعلاه</p>
                      </div>
                    ) : (
                      list.items.map((item, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 ${colors.item} rounded-lg border`}>
                          <span className={`text-gray-900 text-sm flex-1 truncate pl-2 ${list.name === "أيات مقترحة للحفظ" ? "leading-relaxed" : ""}`}>
                            {item}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(list.id, index)}
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
              {list.items.length > 0 && (
                <Card className="shadow-sm border border-gray-200 mt-4">
                  <CardContent className="p-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleClearList(list.id, list.name)}
                      disabled={clearListMutation.isPending}
                      className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs p-2 h-auto w-full"
                    >
                      <Trash2 className="h-3 w-3 ml-1" />
                      مسح جميع العناصر
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}