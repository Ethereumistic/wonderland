'use client'
import React, { useEffect, useState } from 'react';
import { getTeachers } from '@/lib/teacherUtils'; // Adjust the import path as necessary
import { TeacherType } from '@/types/teacher'; // Adjust the import path as necessary
import Image from 'next/image';

const About = () => {
    const [teachers, setTeachers] = useState<TeacherType[]>([]);
  
    useEffect(() => {
      const fetchTeachers = async () => {
        const data = await getTeachers();
        setTeachers(data);
      };
  
      fetchTeachers();
    }, []);
  
    return (
      <div className='flex justify-center items-center mt-48 flex-col'>
        <h1 className='text-4xl font-russo mb-8 text-purple'>За Нас</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 mx-12'>
          {teachers.map((teacher) => (
            <div key={teacher._id} className='bg-purple/[0.2] shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 p-4 flex flex-col h-full border border-purple'>
              <div className='flex flex-col items-center justify-center flex-grow'>
              
                {teacher.image && (
                  <img
                    src={teacher.image.asset.url}
                    alt={teacher.name}
                    className='w-64 h-64 object-cover rounded-full  mb-4'
                  />
                )}
                <h2 className='text-xl font-semibold text-purple'>{teacher.name}</h2>
                <div className='flex flex-col items-center justify-center flex-grow'>
                <p className='text-gray-500 text-sm mx-8 my-4 text-center'>{teacher.description}</p>
                <ul className='text-gray-500 italic text-sm text-center'>
                  {(Array.isArray(teacher.experience) ? teacher.experience : []).map((exp, index) => (
                    <li key={index} className='list-disc'>{exp}</li>
                  ))}
                </ul>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default About;