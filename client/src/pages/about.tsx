import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Star, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function About() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("rafiq-salat-app@proton.me");
      setCopied(true);
      toast({
        title: "تم النسخ!",
        description: "تم نسخ البريد الإلكتروني بنجاح",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "فشل النسخ",
        description: "لم يتم نسخ البريد الإلكتروني",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4" dir="rtl">
      {/* Header Section */}
      <div className="text-right mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">حول رفيق الصلاة</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           صمم هذا التطبيق البسيط لمساعدة المستخدم في اختيار سور وآيات للصلاة أو للحفظ والمراجعة
                </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">استخدم التطبيق في أوقات الصلاة لتفادي تكرار نفس السور القصيرة وليساعدك التطبيق على مداومة مراجعة السور والآيات التي تحفظها
        نسعد بتلقي ملاحظاتكم لتحسين هذا التطبيق</p>
        <div className="text-base text-gray-600 max-w-2xl mx-auto mt-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span>• للتواصل:</span>
            <span className="font-mono text-blue-600">rafiq-salat-app@proton.me</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyEmail}
              className="h-6 px-2 text-xs hover:bg-blue-50"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-blue-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <CardTitle>مميزات التطبيق</CardTitle>
            </div>
          
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-lg text-gray-600">
              <li>• يساعد على التنويع في الصلاة ومراجعة المحفوظ باستمرار

</li>
              
              <li>• يشجع على حفظ الجديد
</li>
              <li>• مناسب للجميع كبارًا وصغارًا
  </li>
            <li>•  يمكن تخصيص القوائم بالكامل
            </li>
            <li>•  التطبيق لا يكرر السور/الآيات إلا بعد المرور على جميع السور والآيات في كل جدول
              </li>
            <li>•  قائمة آيات مقترحة تشجع على الحفظ وتساعد للخشوع في الصلاة
              </li>
            </ul>
          </CardContent>
        </Card>

       
      </div>
      {/* Contact/Support */}
      <p className="text-center text-gray-700 leading-relaxed">
        نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به كل من استخدمه  
        <br />
        <span className="text-sm text-gray-500 mt-2 block">
          ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
        </span>
      </p>
    </div>
  );
}