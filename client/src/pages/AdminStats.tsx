export default function AdminStats({ onNavigate }: any){

return(

<div className="min-h-screen bg-gray-50 py-16">

<div className="max-w-6xl mx-auto px-6">

<button
onClick={()=>onNavigate?.("admin-dashboard")}
className="mb-6 text-[#1976D2]"
>
⬅ العودة للإدارة
</button>

<h1 className="text-3xl font-bold text-[#FF9800] mb-8">

إحصائيات المنصة

</h1>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

<div className="bg-white p-6 rounded-xl shadow text-center">

<h3 className="text-xl font-bold">المستخدمون</h3>

<p className="text-3xl text-[#1976D2] mt-3">0</p>

</div>

<div className="bg-white p-6 rounded-xl shadow text-center">

<h3 className="text-xl font-bold">الإعلانات</h3>

<p className="text-3xl text-[#1976D2] mt-3">0</p>

</div>

<div className="bg-white p-6 rounded-xl shadow text-center">

<h3 className="text-xl font-bold">الجلسات</h3>

<p className="text-3xl text-[#1976D2] mt-3">0</p>

</div>

<div className="bg-white p-6 rounded-xl shadow text-center">

<h3 className="text-xl font-bold">الرسائل</h3>

<p className="text-3xl text-[#1976D2] mt-3">0</p>

</div>

</div>

</div>

</div>

)

}