import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Star } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4" dir="rtl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">حول رفيق الصلاة</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          تطبيق شامل لإدارة وتنظيم الآيات القرآنية، مصمم لمساعدة المسلمين في حفظ ومراجعة كلام الله العزيز
        </p>
      </div>

      {/* Mission Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <CardTitle className="text-xl">رسالتنا</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            نسعى إلى تسهيل رحلة حفظ القرآن الكريم من خلال توفير أداة بسيطة وفعالة لتنظيم الآيات والسور،
            وإنشاء قوائم مخصصة تناسب احتياجات كل مستخدم في رحلته مع كتاب الله.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <CardTitle>إدارة ذكية للآيات</CardTitle>
            </div>
            <CardDescription>
              نظام متطور لتصنيف وتنظيم الآيات القرآنية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• تصنيف الآيات حسب الطول (قصيرة وطويلة)</li>
              <li>• قائمة مخصصة للآيات المقترحة للحفظ</li>
              <li>• إضافة وتعديل الآيات بسهولة</li>
              <li>• البحث والتصفية المتقدمة</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-purple-600" />
              <CardTitle>الاختيار العشوائي</CardTitle>
            </div>
            <CardDescription>
              ميزة فريدة لإنشاء تشكيلات متنوعة من الآيات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• اختيار عشوائي من كل قائمة</li>
              <li>• تنويع المحتوى اليومي</li>
              <li>• مساعدة في المراجعة الدورية</li>
              <li>• تحفيز الحفظ المستمر</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <CardTitle>كيف يعمل التطبيق؟</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">أنشئ قوائمك</h3>
              <p className="text-sm text-gray-600">أضف الآيات والسور إلى القوائم المناسبة</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">نظم محتواك</h3>
              <p className="text-sm text-gray-600">صنف الآيات حسب الطول والأولوية</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">ابدأ المراجعة</h3>
              <p className="text-sm text-gray-600">استخدم الاختيار العشوائي للمراجعة اليومية</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact/Support */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-center">نسأل الله التوفيق والسداد</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 leading-relaxed">
            نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به كل من استخدمه في حفظ كتابه العزيز.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ" - القمر: 17
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}