// app/dashboard/ParentDashboard.tsx
'use client';
import { useState, useEffect } from 'react';

export default function ParentDashboard({ session }: { session: any }) {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    // Fetch children data
    const fetchChildren = async () => {
      const res = await fetch('/api/parent/children');
      const data = await res.json();
      setChildren(data);
    };
    fetchChildren();
  }, []);

  return (
    <div>
      <h1>Parent Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <h2>Your Children:</h2>
      {/* <ul>
        {children.map((child) => (
          <li key={child.id}>{child.name}</li>
        ))}
      </ul> */}
      {/* Add more parent-specific functionality */}
    </div>
  );
}