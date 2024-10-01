import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(req: Request) {
  const body = await req.json(); // Parse the JSON body
  console.log("Received request:", req.method, {
    email: body.email,
    role: body.role,
    firstName: body.firstName,
    lastName: body.lastName,
  }); // Log incoming request without the password and username

  const { email, password, role, firstName, lastName } = body;

  if (!email || !password || !role || !firstName || !lastName) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  // Hash password
  const passwordHash = await hash(password, 12);

  // Create new user
  const result = await db.collection('users').insertOne({
    email,
    passwordHash,
    role,
    firstName,
    lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // If user is a student, create a student record
  if (role === 'student') {
    await db.collection('students').insertOne({
      userId: result.insertedId,
      firstName: firstName,
      lastName: lastName,
      grade: [],
      class: '',
      parentIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}