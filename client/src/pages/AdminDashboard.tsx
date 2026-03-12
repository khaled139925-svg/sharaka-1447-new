export default function AdminDashboard({ onNavigate }: any){

return(

<div className="min-h-screen bg-gray-50 py-16">

<div className="max-w-6xl mx-auto px-6">

<div className="mb-10">

<button
onClick={()=>onNavigate?.("home")}
className="text-[#1976D2] hover:text-[#FF9800] text-lg flex items-center gap-2"
>

🏠 الرئيسية

</button>

</div>

<h1 className="text-4xl font-bold text-center text-[#FF9800] mb-12">

لوحة إدارة منصة شراكة

</h1>

<div className="grid md:grid-cols-3 gap-6">

{/* المستخدمون */}
<div
onClick={()=>onNavigate?.("admin-users")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-2xl"
>

<h3 className="text-xl font-bold mb-3">المستخدمون</h3>

<p className="text-gray-600">إدارة حسابات الأعضاء</p>

</div>

{/* الإعلانات */}
<div
onClick={()=>onNavigate?.("admin-ads")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-2xl"
>

<h3 className="text-xl font-bold mb-3">الإعلانات</h3>

<p className="text-gray-600">مراقبة الإعلانات</p>

</div>

{/* الجلسات */}
<div
onClick={()=>onNavigate?.("admin-meetings")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-2xl"
>

<h3 className="text-xl font-bold mb-3">الجلسات</h3>

<p className="text-gray-600">مراقبة الاجتماعات</p>

</div>

{/* الرسائل */}
<div
onClick={()=>onNavigate?.("admin-messages")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-2xl"
>

<h3 className="text-xl font-bold mb-3">الرسائل</h3>

<p className="text-gray-600">رسائل التواصل</p>

</div>

{/* الإحصائيات */}
<div
onClick={()=>onNavigate?.("admin-stats")}
className="bg-white shadow-lg rounded-xl p-6 text-center cursor-pointer hover:shadow-2xl"
>

<h3 className="text-xl font-bold mb-3">الإحصائيات</h3>

<p className="text-gray-600">إحصائيات المنصة</p>

</div>

</div>

</div>

</div>

)

}