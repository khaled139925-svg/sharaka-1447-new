import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('jobs').select('*').then(({ data }) => setJobs(data || []));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">الفرص المتاحة</h1>
      {jobs.map(job => (
        <div key={job.id} className="border p-4 mb-2 rounded shadow">
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
}