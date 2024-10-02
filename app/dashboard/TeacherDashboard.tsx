'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { IconEdit, IconPlus, IconX } from '@tabler/icons-react'; // Importing a plus icon
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
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); // State for edit modal
  const [editingGrade, setEditingGrade] = useState<{ testTitle: string; score: number } | null>(null);

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

  const openEditModal = (gradeObj: { testTitle: string; score: number }) => {
    setEditingGrade(gradeObj);
    setEditModalIsOpen(true);
  };
  
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setEditingGrade(null); // Reset editing grade
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

  const editGrade = async () => {
    if (selectedStudentId && editingGrade) {
      try {
        const response = await fetch(`/api/students/${selectedStudentId}/grades`, {
          method: 'PUT', // Use PUT method for updating
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ grade: editingGrade }), // Send updated grade
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        // Update the local state to reflect the edited grade
        const updatedStudents = students.map((student: Student) => {
          if (student._id.toString() === selectedStudentId) {
            return { 
              ...student, 
              grade: student.grade?.map(g => 
                g.testTitle === editingGrade.testTitle ? editingGrade : g // Update the specific grade
              ) 
            };
          }
          return student;
        });
        setStudents(updatedStudents);
        closeEditModal();
      } catch (error) {
        console.error('Failed to edit grade:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-32 h-screen">
      
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {session.user.email}, {session.user.firstName} {session.user.lastName}</p>
      <div className="flex flex-col items-center mt-32 h-screen">
      <h2>Your Students:</h2>
      <ul className="w-[600px]">
        {students.map((student: Student) => (
          <li key={student._id} className="flex flex-col mb-2 items-center">
            <div onClick={() => toggleAccordion(student._id)} 
            className="flex flex-row items-center 
            w-full justify-between border 
            border-purple py-2 px-4 rounded-t-md
            cursor-pointer bg-purple/[0.1] ">
               
              
              <span className="text-cyan text-3xl">{student.firstName} {student.lastName}</span> 
              <IconPlus onClick={() => openModal(student._id)} className="text-green-500 ml-8 text-3xl" />
            </div>
            {openAccordion === student._id && (
              <div className="border bg-cyan/[0.1] border-l-cyan border-r-cyan border-b-cyan  py-2 px-4 rounded-b-md w-full mx-auto flex flex-col items-center">
                {/* Render student's grades */}
                <p className="text-purple text-3xl font-bold">Grades:</p>
                <ul className=" ">
                  {student.grade && student.grade.map((gradeObj, index) => (
                    <li className="flex flex-row items-center w-full justify-between
                    border-b border-cyan py-2 px-4" key={index}>
                      <span className="text-cyan text-3xl ">{gradeObj.testTitle}:</span> <span className="text-purple font-bold ml-8 text-3xl">{gradeObj.score}%</span>
                      <IconEdit onClick={() => openEditModal(gradeObj)} className="text-cyan ml-8 text-3xl" />
                      </li> // Display title and score
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      </div>
      <button onClick={() => signOut()}>Sign out</button>

      {/* Modal for adding grades */}
<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  className="fixed inset-0 flex items-center justify-center z-50"
  ariaHideApp={false}
>
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
    <div className="flex flex-row  w-full justify-between">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Add Grade</h2>
        <IconX onClick={closeModal} className="text-black  text-3xl" />
      </div>

    <input
      type="text"
      value={newTestTitle}
      onChange={(e) => setNewTestTitle(e.target.value)}
      placeholder="Enter test title"
      className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan"
    />

    <input
      type="number"
      value={newGrade}
      onChange={(e) => setNewGrade(e.target.value)}
      placeholder="Enter grade"
      className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan"
    />

    <div className="flex justify-end space-x-4">
      <button
        onClick={addGrade}
        className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple transition-colors"
      >
        Submit
      </button>
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-cyan text-white rounded-md hover:bg-cyan transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>


{/* EDIT MODAL */}
<Modal
  isOpen={editModalIsOpen}
  onRequestClose={closeEditModal}
  className="fixed inset-0 flex items-center justify-center z-50"
  ariaHideApp={false}
>
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
    <div className="flex flex-row w-full justify-between">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">Edit Grade</h2>
      <IconX onClick={closeEditModal} className="text-black text-3xl" />
    </div>

    <input
      type="text"
      value={editingGrade?.testTitle || ''}
      onChange={(e) => setEditingGrade({ 
        ...editingGrade, 
        testTitle: e.target.value 
      } as { testTitle: string; score: number })} // Ensure testTitle is a string
      placeholder="Enter test title"
      className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan"
    />

    <input
      type="number"
      value={editingGrade?.score || 0} // Default to 0 if score is undefined
      onChange={(e) => setEditingGrade({ 
        ...editingGrade, 
        score: Number(e.target.value) || 0 // Ensure score is a number
      } as { testTitle: string; score: number })} // Ensure score is a number
      placeholder="Enter grade"
      className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan"
    />

    <div className="flex justify-end space-x-4">
      <button
        onClick={async () => {
          await editGrade(); // Ensure editGrade is called
          closeEditModal(); // Close modal after submission
        }}
        className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple transition-colors"
      >
        Submit
      </button>
      <button
        onClick={closeEditModal}
        className="px-4 py-2 bg-cyan text-white rounded-md hover:bg-cyan transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}