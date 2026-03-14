import { useState } from "react";

export default function Dashboard({ onNavigate }: any) {

const [tab,setTab] = useState("profile");

const [profile,setProfile] = useState({
name:"اسم المستخدم",
email:"user@email.com",
phone:"05xxxxxxxx",
bio:"نبذة عني",
specialty:"استشارات أعمال",
country:"السعودية"
});

const [editing,setEditing] = useState<string | null>(null);

const [sessions,setSessions] = useState([
{
id:1,
client:"أحمد",
type:"استشارة أعمال",
date:"2025-03-20",
status:"pending"
}
]);

const logout = ()=>{
onNavigate?.("home");
};

const acceptSession=(id:number)=>{
setSessions(
sessions.map(s=>s.id===id ? {...s,status:"accepted"} : s)
);
};

const rejectSession=(id:number)=>{
setSessions(
sessions.map(s=>s.id===id ? {...s,status:"rejected"} : s)
);
};

return(

<div style={{padding:"40px",background:"#f5f7fb",minHeight:"100vh"}}>

<div style={{display:"flex",justifyContent:"space-between"}}>

<h2>حسابي</h2>

<button
onClick={logout}
style={{
background:"#e53935",
color:"white",
border:"none",
padding:"8px 16px",
borderRadius:"6px",
cursor:"pointer"
}}
>
تسجيل الخروج
</button>

</div>

<div style={{display:"flex",gap:"10px",marginTop:"30px",marginBottom:"30px"}}>

<button onClick={()=>setTab("profile")}>الملف الشخصي</button>
<button onClick={()=>setTab("sessions")}>الجلسات</button>
<button onClick={()=>setTab("services")}>الخدمات</button>

</div>

{/* PROFILE */}

{tab==="profile" && (

<div style={{background:"white",padding:"20px",borderRadius:"10px"}}>

<h3>الملف الشخصي</h3>

<p>
<b>الاسم:</b> {profile.name}
<button onClick={()=>setEditing("name")}>✏️</button>
</p>

{editing==="name" && (
<input
value={profile.name}
onChange={(e)=>setProfile({...profile,name:e.target.value})}
/>
)}

<p>
<b>البريد:</b> {profile.email}
</p>

<p>
<b>الهاتف:</b> {profile.phone}
<button onClick={()=>setEditing("phone")}>✏️</button>
</p>

{editing==="phone" && (
<input
value={profile.phone}
onChange={(e)=>setProfile({...profile,phone:e.target.value})}
/>
)}

<p>
<b>التخصص:</b> {profile.specialty}
<button onClick={()=>setEditing("specialty")}>✏️</button>
</p>

{editing==="specialty" && (
<input
value={profile.specialty}
onChange={(e)=>setProfile({...profile,specialty:e.target.value})}
/>
)}

<p>
<b>الدولة:</b> {profile.country}
<button onClick={()=>setEditing("country")}>✏️</button>
</p>

{editing==="country" && (
<input
value={profile.country}
onChange={(e)=>setProfile({...profile,country:e.target.value})}
/>
)}

<p>
<b>نبذة:</b> {profile.bio}
<button onClick={()=>setEditing("bio")}>✏️</button>
</p>

{editing==="bio" && (
<textarea
value={profile.bio}
onChange={(e)=>setProfile({...profile,bio:e.target.value})}
/>
)}

</div>

)}

{/* SESSIONS */}

{tab==="sessions" && (

<div style={{background:"white",padding:"20px",borderRadius:"10px"}}>

<h3>طلبات الجلسات</h3>

{sessions.map(session=>(

<div
key={session.id}
style={{
border:"1px solid #eee",
padding:"15px",
marginBottom:"10px",
borderRadius:"8px"
}}
>

<p>العميل: {session.client}</p>
<p>نوع الجلسة: {session.type}</p>
<p>التاريخ: {session.date}</p>
<p>الحالة: {session.status}</p>

{session.status==="pending" && (

<div style={{marginTop:"10px"}}>

<button
onClick={()=>acceptSession(session.id)}
style={{marginRight:"10px"}}
>
قبول
</button>

<button
onClick={()=>rejectSession(session.id)}
>
رفض
</button>

</div>

)}

</div>

))}

</div>

)}

{/* SERVICES */}

{tab==="services" && (

<div style={{background:"white",padding:"20px",borderRadius:"10px"}}>

<h3>الخدمات</h3>

<button
style={{
background:"#FF9800",
color:"white",
border:"none",
padding:"10px 20px",
borderRadius:"6px",
marginBottom:"20px"
}}
>
إضافة خدمة
</button>

<p>لا توجد خدمات حالياً</p>

</div>

)}

</div>

);
}