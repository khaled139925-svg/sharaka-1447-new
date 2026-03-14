export default function AdCard({ ad }: any){

return(

<div
style={{
background:"white",
borderRadius:"10px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)",
overflow:"hidden"
}}
>

<img
src={ad.image}
style={{
width:"100%",
height:"180px",
objectFit:"cover"
}}
/>

<div style={{padding:"15px"}}>

<h3>{ad.title}</h3>

<p style={{color:"#666"}}>
{ad.category}
</p>

<p style={{fontSize:"14px",color:"#555"}}>
{ad.description.slice(0,80)}...
</p>

<button
onClick={()=>window.location.href="/ad/"+ad.id}
style={{
marginTop:"10px",
background:"#1976D2",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:"6px",
cursor:"pointer"
}}
>

عرض الإعلان

</button>

</div>

</div>

);
}