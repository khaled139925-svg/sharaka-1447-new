<<<<<<< HEAD
import React from 'react';
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
>>>>>>> temp-preview
import { supabase } from "../lib/supabase";

export default function Browse() {
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.log(error);
      return;
    }

    setUsers(data || []);
  }

  return (
    <div className="page">
      <div className="cards">
        {users.map((u) => (
          <div key={u.id} className="card">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${u.avatar})`,
                backgroundSize: "cover",
                width: "80px",
                height: "80px",
                borderRadius: "50%"
              }}
            ></div>

            <h3>{u.name}</h3>
            <p>{u.category}</p>

            <button onClick={() => navigate(`/profile/${u.name}`)}>
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}