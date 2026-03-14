import { useState } from "react";

export default function Dashboard({ onNavigate }: any) {

const [tab,setTab] = useState("profile");
const [editing,setEditing] = useState(false);
const [sessionTab,setSessionTab] = useState("new");

const [profile,setProfile] = useState({
name:"اسم المستخدم",
email:"user@email.com",
phone:"05xxxxxxxx",
country:"السعودية",
specialty:"استشارات أعمال",
bio:"نبذة عني",
type:"فرد"
});

const [sessions,setSessions] = useState([
{
id:1,
client:"أحمد",
type:"استشارة أعمال",
date:"2025-03-20",
duration:"30 دقيقة",
price:"200 ريال",
status:"new"
}
]);

const [orders] = useState([
{
id:1,
client:"محمد",
product:"خدمة استشارة",
price:"300",
qty:"1",
status:"طلب جديد"
}
]);

const logout=()=>{
onNavigate?.("home");
};

return(

<div style={{padding:"40px",background:"#f5f7fb",minHeight:"100vh"}}>

<div style={{display:"flex",justifyContent:"space-between"}}>

<h2>لوحة الحساب</h2>

<button onClick={logout}>
تسجيل الخروج
</button>

</div>

<div style={{display:"flex",gap:"10px",marginTop:"30px"}}>

<button onClick={()=>setTab("profile")}>
الملف الشخصي
</button>

<button onClick={()=>setTab("sessions")}>
الجلسات
</button>

<button onClick={()=>setTab("orders")}>
الطلبات
</button>

</div>

{/* PROFILE */}

{tab==="profile" && (

<div style={{background:"white",padding:"25px",marginTop:"20px"}}>

{!editing && (

<div>

<p><b>الاسم:</b> {profile.name}</p>
<p><b>البريد:</b> {profile.email}</p>
<p><b>الهاتف:</b> {profile.phone}</p>
<p><b>الدولة:</b> {profile.country}</p>
<p><b>التخصص:</b> {profile.specialty}</p>
<p><b>نوع الحساب:</b> {profile.type}</p>
<p><b>النبذة:</b> {profile.bio}</p>

<button onClick={()=>setEditing(true)}>
تعديل الملف الشخصي
</button>

</div>

)}

{editing && (

<div>

<input
value={profile.name}
onChange={(e)=>setProfile({...profile,name:e.target.value})}
/>

<input
value={profile.phone}
onChange={(e)=>setProfile({...profile,phone:e.target.value})}
/>

<input
value={profile.country}
onChange={(e)=>setProfile({...profile,country:e.target.value})}
/>

<input
value={profile.specialty}
onChange={(e)=>setProfile({...profile,specialty:e.target.value})}
/>

<textarea
value={profile.bio}
onChange={(e)=>setProfile({...profile,bio:e.target.value})}
/>

<button onClick={()=>setEditing(false)}>
حفظ
</button>

</div>

)}

</div>

)}

{/* SESSIONS */}

{tab==="sessions" && (

<div style={{background:"white",padding:"25px",marginTop:"20px"}}>

<div style={{display:"flex",gap:"10px"}}>

<button onClick={()=>setSessionTab("new")}>
الطلبات الجديدة
</button>

<button onClick={()=>setSessionTab("accepted")}>
الطلبات المقبولة
</button>

<button onClick={()=>setSessionTab("finished")}>
الجلسات المنتهية
</button>

</div>

{sessions
.filter(s=>s.status===sessionTab)
.map(s=>(

<div key={s.id} style={{border:"1px solid #eee",padding:"15px",marginTop:"10px"}}>

<p>العميل: {s.client}</p>
<p>نوع الجلسة: {s.type}</p>
<p>التاريخ: {s.date}</p>
<p>المدة: {s.duration}</p>
<p>السعر: {s.price}</p>

{sessionTab==="new" && (

<div>

<button>قبول</button>
<button>رفض</button>

</div>

)}

</div>

))}

</div>

)}

{/* ORDERS */}

{tab==="orders" && (

<div style={{background:"white",padding:"25px",marginTop:"20px"}}>

<h3>الطلبات</h3>

{orders.map(o=>(

<div key={o.id} style={{border:"1px solid #eee",padding:"15px",marginTop:"10px"}}>

<p>العميل: {o.client}</p>
<p>الطلب: {o.product}</p>
<p>السعر: {o.price}</p>
<p>الكمية: {o.qty}</p>
<p>الحالة: {o.status}</p>

</div>

))}

</div>

)}

</div>

);
}