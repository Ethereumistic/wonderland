import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { db } = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let queryId = session.user.role === 'student' ? session.user.id : id;

    console.log('Fetching grades for user:', queryId);

    const user = await db.collection('users').findOne({ _id: new ObjectId(queryId) });

    if (!user) {
      console.log('User not found:', queryId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user);
    console.log('Grades:', user.grade || []);

    const grades = Array.isArray(user.grade) ? user.grade : [];


    return NextResponse.json(grades, { status: 200 });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { grade } = await req.json();

  try {
    const { db } = await connectToDatabase();
    const gradeId = new ObjectId();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $push: { grade: { ...grade, _id: gradeId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User not found or grade not added' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grade added successfully', gradeId: gradeId.toString() }, { status: 200 });
  } catch (error) {
    console.error('Error adding grade:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { gradeId, updatedGrade } = await req.json();

  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id), "grade._id": new ObjectId(gradeId) },
      { $set: { "grade.$": { ...updatedGrade, _id: new ObjectId(gradeId) } } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User or grade not found' }, { status: 404 });
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
    
    const result = await db.collection('users').updateOne(
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