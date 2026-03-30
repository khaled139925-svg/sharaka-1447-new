import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ConsultantProfile({ id }:any) {

  const [data,setData] = useState<any>(null);
  const [ads,setAds] = useState<any[]>([]);
  const [payments,setPayments] = useState<any[]>([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async () => {

    const { data } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id)
      .single();

    setData(data);

    const { data:adsData } = await supabase
      .from("ads")
      .select("*")
      .eq("consultant_id", id);

    setAds(adsData || []);

    const { data:payData } = await supabase
      .from("payments")
      .select("*")
      .eq("consultant_id", id);

    setPayments(payData || []);
  };

  if (!data) return <div>تحميل...</div>;

  return (
    <div className="p-10">

      <img src={data.profile_image} className="w-40 h-40 rounded mb-4" />

      <h1>{data.name}</h1>
      <p>{data.specialty}</p>
      <p>{data.bio}</p>

      <h2 className="mt-6">الإعلانات</h2>
      {ads.map(a=>(
        <div key={a.id}>{a.title}</div>
      ))}

      <h2 className="mt-6">طرق الدفع</h2>
      {payments.map(p=>(
        <div key={p.id}>{p.method} - {p.details}</div>
      ))}

    </div>
  );
}