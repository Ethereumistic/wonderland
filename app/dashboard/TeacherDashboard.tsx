// app/dashboard/TeacherDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
export default function TeacherDashboard({ session }: { session: any }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students data
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {session.user.email}, {session.user.firstName} {session.user.lastName}</p>
      <h2>Your Students:</h2>
      <ul>
        {students.map((student: any) => (
          <li key={student._id}>Student ID: {student.firstName} {student.lastName}</li>
        ))}
      </ul>
      {/* Add more teacher-specific functionality */}


      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}