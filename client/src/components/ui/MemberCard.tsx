export default function MemberCard({ member }: any) {

return (

<div
style={{
background:"white",
borderRadius:"12px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)",
overflow:"hidden",
width:"280px",
display:"flex",
flexDirection:"column",
justifyContent:"space-between"
}}
>

<img
src={member.image}
alt={member.name}
style={{
width:"100%",
height:"180px",
objectFit:"cover"
}}
/>

<div style={{padding:"15px"}}>

<h3 style={{margin:"5px 0"}}>
{member.name}
</h3>

<p style={{color:"#666",margin:"3px 0"}}>
{member.specialty}
</p>

<p style={{color:"#999",fontSize:"14px"}}>
{member.country}
</p>

<p style={{
marginTop:"10px",
fontSize:"14px",
color:"#555"
}}>
{member.bio}
</p>

<button
onClick={()=>window.location.href="/member/"+member.id}
style={{
marginTop:"15px",
width:"100%",
background:"#1976D2",
color:"white",
border:"none",
padding:"10px",
borderRadius:"6px",
cursor:"pointer"
}}
>
عرض التفاصيل
</button>

</div>

</div>

);
}