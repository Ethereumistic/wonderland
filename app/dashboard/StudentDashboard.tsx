'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function StudentDashboard({ session }: { session: any }) {
  const [grades, setGrades] = useState<{ testTitle: string; score: number }[]>([]); // Update type to reflect the new structure
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await fetch(`/api/students/${session.user.id}/grades`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error: ${res.statusText}`);
        }
        const data = await res.json();
        setGrades(data);
      } catch (error) {
        console.error('Failed to fetch grades:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [session.user.id]);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <h2>Your Grades:</h2>
      {loading ? (
        <p>Loading grades...</p>
      ) : (
        <ul>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <li key={index}>
                {grade.testTitle}: {grade.score}%
              </li>
            ))
          ) : (
            <li>No grades available.</li>
          )}
        </ul>
      )}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}