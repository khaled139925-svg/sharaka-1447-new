export default function UserDashboard({ onNavigate }: any){

return(

<div className="min-h-screen bg-gray-50 py-16">

<div className="max-w-6xl mx-auto px-6">

<div className="mb-10 flex justify-between items-center">

<h1 className="text-3xl font-bold text-[#FF9800]">

لوحة حسابي

</h1>

<button
onClick={()=>onNavigate?.("home")}
className="text-[#1976D2]"
>
🏠 الرئيسية
</button>

</div>

<div className="grid md:grid-cols-3 gap-6">

<div
onClick={()=>onNavigate?.("profile")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer"
>

<h3 className="text-xl font-bold mb-2">👤 الملف الشخصي</h3>

<p className="text-gray-600">
تعديل معلومات الحساب
</p>

</div>

<div
onClick={()=>onNavigate?.("my-ads")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer"
>

<h3 className="text-xl font-bold mb-2">📢 إعلاناتي</h3>

<p className="text-gray-600">
إدارة الإعلانات
</p>

</div>

<div
onClick={()=>onNavigate?.("my-meetings")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer"
>

<h3 className="text-xl font-bold mb-2">🎥 جلساتي</h3>

<p className="text-gray-600">
الجلسات والاجتماعات
</p>

</div>

<div
onClick={()=>onNavigate?.("messages")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer"
>

<h3 className="text-xl font-bold mb-2">💬 الرسائل</h3>

<p className="text-gray-600">
محادثات المستخدمين
</p>

</div>

<div
onClick={()=>onNavigate?.("account-settings")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer"
>

<h3 className="text-xl font-bold mb-2">⚙️ إعدادات الحساب</h3>

<p className="text-gray-600">
إعدادات الحساب
</p>

</div>

</div>

</div>

</div>

)

}