import AdCard from "../components/ui/AdCard";

export default function Ads(){

const ads = [

{
id:1,
title:"استشارة تسويق رقمي",
category:"استشارات",
description:"استشارة كاملة لتحليل مشروعك ووضع خطة تسويق ناجحة",
image:"https://via.placeholder.com/400"
},

{
id:2,
title:"تصميم متجر الكتروني",
category:"خدمات",
description:"إنشاء متجر احترافي كامل مع بوابة دفع",
image:"https://via.placeholder.com/400"
}

];

return(

<div style={{padding:"40px",background:"#f5f7fb",minHeight:"100vh"}}>

<h2>الإعلانات</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
gap:"20px",
marginTop:"20px"
}}
>

{ads.map(ad=>(
<AdCard key={ad.id} ad={ad}/>
))}

</div>

</div>

);
}