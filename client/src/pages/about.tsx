import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Star } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4" dir="rtl">
      {/* Header Section */}
      <div className="text-right mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">حول رفيق الصلاة</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           صمم هذا التطبيق البسيط لمساعدة المستخدم في اختيار سور وآيات للصلاة أو للحفظ والمراجعة
                </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           استخدم التطبيق في أوقات الصلاة لتفادي تكرار نفس السور القصيرة وليساعدك التطبيق على مداومة مراجعة السور والآيات التي تحفظها
                </p>
        <ul className="text-base text-gray-600 max-w-2xl mx-auto mt-4">
          <li>• للتواصل: rafiq-salat-app@proton.me</li>
        </ul>
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