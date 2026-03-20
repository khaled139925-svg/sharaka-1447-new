import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function BrowseAll({ onNavigate }:any) {

  const [data,setData] = useState<any[]>([]);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData = async () => {
    const { data } = await supabase.from("consultants").select("*");
    setData(data || []);
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl mb-6">تصفح الجميع</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {data.map((c)=>(
          <div key={c.id} className="border p-4 rounded shadow">

            <img
              src={c.profile_image}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h3 className="font-bold">{c.name}</h3>
            <p>{c.specialty}</p>
            <p className="text-sm text-gray-600">{c.bio}</p>

            <button
              onClick={()=>onNavigate("profile", c.id)}
              className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
            >
              تفاصيل
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}