import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  return (
    <div style={{ padding: 20 }}>
      {posts.map((post) => (
        <div key={post.id} style={{
          background: "#fff",
          marginBottom: 20,
          padding: 10,
          borderRadius: 10
        }}>

          {post.media_type === "image" && (
            <img src={post.media_url} style={{ width: "100%" }} />
          )}

          {post.media_type === "video" && (
            <video src={post.media_url} controls style={{ width: "100%" }} />
          )}

          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}