import { useState } from "react";

export default function AddAd() {

const [title,setTitle] = useState("");
const [category,setCategory] = useState("");
const [description,setDescription] = useState("");
const [price,setPrice] = useState("");
const [phone,setPhone] = useState("");

const [images,setImages] = useState<any[]>([]);
const [videos,setVideos] = useState<any[]>([]);

const handleImages = (e:any)=>{
setImages([...e.target.files]);
};

const handleVideos = (e:any)=>{
setVideos([...e.target.files]);
};

const handleSubmit = (e:any)=>{
e.preventDefault();

const ad = {
title,
category,
description,
price,
phone,
images,
videos
};

console.log(ad);

alert("تم إضافة الإعلان");
};

return(

<div style={{padding:"40px",background:"#f5f7fb",minHeight:"100vh"}}>

<h2>إضافة إعلان</h2>

<form
onSubmit={handleSubmit}
style={{
background:"white",
padding:"25px",
borderRadius:"10px",
maxWidth:"600px",
marginTop:"20px"
}}
>

<label>عنوان الإعلان</label>

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
/>

<label>اختر القسم</label>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
>

<option>استشارات</option>
<option>خدمات</option>
<option>منتجات</option>

</select>

<label>وصف الإعلان</label>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
/>

<label>إضافة صور</label>

<input
type="file"
multiple
accept="image/*"
onChange={handleImages}
style={{marginBottom:"15px"}}
/>

<label>إضافة فيديو</label>

<input
type="file"
multiple
accept="video/*"
onChange={handleVideos}
style={{marginBottom:"15px"}}
/>

<label>السعر (اختياري)</label>

<input
value={price}
onChange={(e)=>setPrice(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"15px"}}
/>

<label>رقم التواصل</label>

<input
value={phone}
onChange={(e)=>setPhone(e.target.value)}
style={{width:"100%",padding:"10px",marginBottom:"20px"}}
/>

<button
type="submit"
style={{
background:"#1976D2",
color:"white",
border:"none",
padding:"12px 20px",
borderRadius:"6px",
cursor:"pointer"
}}
>

نشر الإعلان

</button>

</form>

</div>

);
}