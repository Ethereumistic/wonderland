import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const students = await db.collection('users').find({ role: 'student' }).toArray();
    
    // Ensure each student has a grades array
    const studentsWithGrades = students.map(student => ({
      ...student,
      grade: Array.isArray(student.grade) ? student.grade : []
    }));
    
    console.log('Fetched students:', JSON.stringify(studentsWithGrades, null, 2));
    return NextResponse.json(studentsWithGrades);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}