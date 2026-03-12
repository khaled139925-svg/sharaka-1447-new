export default function AdminAds({ onNavigate }: any){

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

إدارة الإعلانات

</h1>

<div className="bg-white p-6 rounded-xl shadow">

<p>هنا ستظهر جميع الإعلانات المنشورة في المنصة.</p>

</div>

</div>

</div>

)

}