'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react'; // Importing a plus icon
import Modal from 'react-modal'; // Ensure you have react-modal installed
import MMenu from '../components/management/mMenu';

interface Grade {
  _id: string;
  testTitle: string;
  score: number;
  studentId: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  grade?: Grade[];
  role?: string;
}

export default function TeacherDashboard({ session }: { session: any }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [newGrade, setNewGrade] = useState('');
  const [newTestTitle, setNewTestTitle] = useState('');


  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    };

    const fetchGrades = async () => {
      if (session?.user?.id) {
        const res = await fetch(`/api/students/${session.user.id}/grades`);
        const gradesData = await res.json();
        
        // Log the fetched grades data
        console.log('Fetched Grades Data:', gradesData);
 
        // Check if gradesData is an array
        if (!Array.isArray(gradesData)) {
          console.error('Expected gradesData to be an array, but got:', gradesData);
          return; // Exit if gradesData is not an array
        }
 
        setStudents((prevStudents) => 
          prevStudents.map(student => ({
            ...student,
            grade: gradesData.filter(grade => grade.studentId === student._id)
          }))
        );
      }
    };

    fetchStudents();
    fetchGrades();
  }, [session]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const openModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditModalIsOpen(false);
    setDeleteModalIsOpen(false);
    setNewGrade('');
    setNewTestTitle('');
  };

  const openEditModal = (studentId: string, grade: Grade) => {
    setSelectedStudentId(studentId);
    setSelectedGrade(grade);
    setNewTestTitle(grade.testTitle);
    setNewGrade(grade.score.toString());
    setEditModalIsOpen(true);
  };

  const openDeleteModal = (studentId: string, grade: Grade) => {
    setSelectedStudentId(studentId);
    setSelectedGrade(grade);
    setDeleteModalIsOpen(true);
  };

  const addGrade = async () => {
    if (selectedStudentId && newGrade && newTestTitle) {
      try {
        const response = await fetch(`/api/students/${selectedStudentId}/grades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ grade: { testTitle: newTestTitle, score: Number(newGrade), studentId: selectedStudentId } }), // Include studentId here
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const result = await response.json();
  
        // Update the local state to reflect the new grade
        const updatedStudents: Student[] = students.map((student: Student) => {
          if (student._id === selectedStudentId) {
            return {
              ...student,
              grade: [
                ...(student.grade || []),
                { _id: result.gradeId, testTitle: newTestTitle, score: Number(newGrade), studentId: selectedStudentId } // Include studentId here
              ]
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
    if (selectedStudentId && selectedGrade && newGrade && newTestTitle) {
      try {
        const response = await fetch(`/api/students/${selectedStudentId}/grades`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gradeId: selectedGrade._id,
            updatedGrade: { testTitle: newTestTitle, score: Number(newGrade) }
          }),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        setStudents(students.map((student) => {
          if (student._id === selectedStudentId) {
            return {
              ...student,
              grade: student.grade?.map((g) =>
                g._id === selectedGrade._id
                  ? { ...g, testTitle: newTestTitle, score: Number(newGrade) }
                  : g
              )
            };
          }
          return student;
        }));
        closeModal();
      } catch (error) {
        console.error('Failed to edit grade:', error);
      }
    }
  };
  
  const deleteGrade = async () => {
    if (selectedStudentId && selectedGrade) {
      try {
        const response = await fetch(`/api/students/${selectedStudentId}/grades`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gradeId: selectedGrade._id }),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        setStudents(students.map((student) => {
          if (student._id === selectedStudentId) {
            return {
              ...student,
              grade: student.grade?.filter((g) => g._id !== selectedGrade._id)
            };
          }
          return student;
        }));
        closeModal();
      } catch (error) {
        console.error('Failed to delete grade:', error);
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center mt-32 h-screen">
      <div className="my-8">
      <MMenu />
      </div>
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

                      <span className="flex flex-row ml-12">
                      <IconEdit onClick={() => openEditModal(student._id, gradeObj)} className="text-cyan ml-8 text-3xl cursor-pointer" />
                      <IconTrash onClick={() => openDeleteModal(student._id, gradeObj)} className="text-red-500 ml-8 text-3xl cursor-pointer" />
                      </span>
                      </li>
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

      {/* Modal for editing grades */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex flex-row w-full justify-between">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Edit Grade</h2>
            <IconX onClick={closeModal} className="text-black text-3xl cursor-pointer" />
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
              onClick={editGrade}
              className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple transition-colors"
            >
              Update
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

{/* Modal for deleting grades */}
<Modal
  isOpen={deleteModalIsOpen}
  onRequestClose={closeModal}
  className="fixed inset-0 flex items-center justify-center z-50"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full">
    <div className="flex flex-row w-full justify-between">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Delete Grade</h2>
      <IconX onClick={closeModal} className="text-black text-3xl cursor-pointer" />
    </div>
    <p className="mb-4">Are you sure you want to delete this grade? This action cannot be undone.</p>
    <p className="mb-4 font-semibold">
      {selectedGrade ? `${selectedGrade.testTitle}: ${selectedGrade.score}%` : ''}
    </p>
    <div className="flex justify-end space-x-4">
      <button
        onClick={deleteGrade}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
}