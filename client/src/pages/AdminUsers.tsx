export default function AdminUsers({ onNavigate }: any){

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

إدارة المستخدمين

</h1>

<div className="bg-white p-6 rounded-xl shadow">

<table className="w-full text-right">

<thead>

<tr className="border-b">

<th className="py-3">الاسم</th>
<th>البريد</th>
<th>الدولة</th>
<th>الإجراءات</th>

</tr>

</thead>

<tbody>

<tr className="border-b">

<td className="py-3">أحمد محمد</td>
<td>ahmed@email.com</td>
<td>السعودية</td>
<td className="text-red-500 cursor-pointer">حذف</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

)

}