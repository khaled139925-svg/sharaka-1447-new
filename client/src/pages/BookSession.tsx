import React from 'react';
import { useState } from "react";

export default function BookSession({ onNavigate }: any) {

const [date,setDate] = useState("");
const [time,setTime] = useState("");
const [type,setType] = useState("استشارة أعمال");

const handleBooking = () => {

if(!date || !time){
alert("يرجى اختيار التاريخ والوقت");
return;
}

alert("تم إرسال طلب الجلسة بنجاح");

onNavigate?.("home");

};

return(

<div style={{
padding:"40px",
background:"#f5f7fb",
minHeight:"100vh"
}}>

<h2>حجز جلسة استشارية</h2>

<div style={{
background:"white",
padding:"25px",
borderRadius:"10px",
maxWidth:"500px",
marginTop:"20px"
}}>

<p><b>المستشار:</b> مستشار الأعمال</p>

<p><b>سعر الجلسة:</b> 200 ريال</p>

<div style={{marginTop:"15px"}}>

<label>نوع الجلسة</label>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
style={{width:"100%",padding:"10px",marginTop:"5px"}}
>

<option>استشارة أعمال</option>
<option>استشارة قانونية</option>
<option>استشارة تسويق</option>

</select>

</div>

<div style={{marginTop:"15px"}}>

<label>التاريخ</label>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
style={{width:"100%",padding:"10px",marginTop:"5px"}}
/>

</div>

<div style={{marginTop:"15px"}}>

<label>الوقت</label>

<input
type="time"
value={time}
onChange={(e)=>setTime(e.target.value)}
style={{width:"100%",padding:"10px",marginTop:"5px"}}
/>

</div>

<button
onClick={handleBooking}
style={{
marginTop:"20px",
background:"#1976D2",
color:"white",
border:"none",
padding:"12px 20px",
borderRadius:"6px",
cursor:"pointer"
}}
>

حجز الجلسة

</button>

</div>

</div>

);
}