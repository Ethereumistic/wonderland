'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function StudentDashboard({ session }: { session: any }) {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // Fetch grades data
    const fetchGrades = async () => {
      const res = await fetch('/api/student/grades');
      const data = await res.json();
      setGrades(data);
    };
    fetchGrades();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <h2>Your Grades:</h2>
      {/* <ul>
        {grades.map((grade) => (
          <li key={grade.id}>{grade.subject}: {grade.score}</li>
        ))}
      </ul> */}
      {/* Add more student-specific functionality */}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}