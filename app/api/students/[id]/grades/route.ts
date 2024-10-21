import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/authOptions';


   // FETCH GRADES
   export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug: Log the session
 
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    const userId = session.user.id;
    console.log('User ID:', userId); // Debug: Log the user ID
 
    try {
      const { db } = await connectToDatabase();
      
      // Fetch student data using ObjectId
      const student = await db.collection('students').findOne({ _id: new ObjectId(params.id) }); // Use params.id to find the student
      console.log('Student found:', student); // Debug: Log the student object
 
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
 
      return NextResponse.json(student.grade || [], { status: 200 });
    } catch (error) {
      console.error('Error fetching grades:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

//ADD GRADES
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { grade } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Generate a new ObjectId for the grade
    const gradeId = new ObjectId();

    // Update the student's grade in the database
    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $push: { grade: { ...grade, _id: gradeId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Student not found or grade not added' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grade added successfully', gradeId: gradeId.toString() }, { status: 200 });
  } catch (error) {
    console.error('Error adding grade:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// EDIT GRADE
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { gradeId, updatedGrade } = await req.json();

  if (!id || !gradeId) {
    return NextResponse.json({ error: 'Student ID and Grade ID are required' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id), "grade._id": new ObjectId(gradeId) },
      { $set: { "grade.$": { ...updatedGrade, _id: new ObjectId(gradeId) } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Student or grade not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grade updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating grade:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE GRADE
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { gradeId } = await req.json();

  if (!id || !gradeId) {
    return NextResponse.json({ error: 'Student ID and Grade ID are required' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $pull: { grade: { _id: new ObjectId(gradeId) } } } as any // Type assertion to avoid TypeScript error
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Student or grade not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grade deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting grade:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}