import { useState } from "react";

export default function AdminLogin({ onNavigate }: any) {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

function handleLogin(){

if(email === "admin@sharaka.com" && password === "123456"){

onNavigate?.("admin-dashboard");

}else{

alert("بيانات الدخول غير صحيحة");

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">

<h1 className="text-3xl font-bold text-center text-[#FF9800] mb-8">

دخول الإدارة

</h1>

<input
type="email"
placeholder="البريد الإلكتروني"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border p-3 rounded mb-4"
/>

<input
type="password"
placeholder="كلمة المرور"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border p-3 rounded mb-6"
/>

<button
onClick={handleLogin}
className="w-full bg-[#1976D2] text-white py-3 rounded hover:bg-blue-700 transition"
>

تسجيل الدخول

</button>

<div className="mt-6 text-center">

<button
onClick={()=>onNavigate?.("home")}
className="text-[#1976D2] hover:text-[#FF9800]"
>

🏠 العودة للرئيسية

</button>

</div>

</div>

</div>

)

}