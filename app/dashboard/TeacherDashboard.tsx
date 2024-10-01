'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { IconPlus } from '@tabler/icons-react'; // Importing a plus icon
import Modal from 'react-modal'; // Ensure you have react-modal installed

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade?: { testTitle: string; score: number }[]; // Updated to an array of objects
  role?: string; // Optional role if needed
}

export default function TeacherDashboard({ session }: { session: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null); // State for accordion
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null); // Track selected student for adding grade
  const [newGrade, setNewGrade] = useState(''); // State for new grade input
  const [newTestTitle, setNewTestTitle] = useState(''); // State for new test title input

  useEffect(() => {
    // Fetch students data
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id); // Toggle accordion
  };

  const openModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewGrade('');
    setNewTestTitle(''); // Reset test title
  };

  const addGrade = async () => {
    if (selectedStudentId && newGrade && newTestTitle) {
      try {
        const response = await fetch(`/api/students/${selectedStudentId}/grades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ grade: { testTitle: newTestTitle, score: Number(newGrade) } }), // Send both title and grade
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();

        // Update the local state to reflect the new grade
        const updatedStudents = students.map((student: Student) => {
          if (student._id.toString() === selectedStudentId) {
            return { 
              ...student, 
              grade: [...(student.grade || []), { testTitle: newTestTitle, score: Number(newGrade) }] // Update to new structure
            };
          }
          return student;
        });
        setStudents(updatedStudents);
        closeModal();
      } catch (error) {
        console.error('Failed to add grade:', error);
      }
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {session.user.email}, {session.user.firstName} {session.user.lastName}</p>
      <h2>Your Students:</h2>
      <ul>
        {students.map((student: Student) => (
          <li key={student._id}>
            <div onClick={() => toggleAccordion(student._id)} style={{ cursor: 'pointer' }}>
              Student ID: {student.firstName} {student.lastName} 
              <IconPlus onClick={() => openModal(student._id)} style={{ marginLeft: '10px', cursor: 'pointer' }} />
            </div>
            {openAccordion === student._id && (
              <div>
                {/* Render student's grades */}
                <p>Grades:</p>
                <ul>
                  {student.grade && student.grade.map((gradeObj, index) => (
                    <li key={index}>{gradeObj.testTitle}: {gradeObj.score}%</li> // Display title and score
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => signOut()}>Sign out</button>

      {/* Modal for adding grades */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Add Grade</h2>
        <input 
          type="text" 
          value={newTestTitle} 
          onChange={(e) => setNewTestTitle(e.target.value)} 
          placeholder="Enter test title" 
        />
        <input 
          type="number" 
          value={newGrade} 
          onChange={(e) => setNewGrade(e.target.value)} 
          placeholder="Enter grade" 
        />
        <button onClick={addGrade}>Submit</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}