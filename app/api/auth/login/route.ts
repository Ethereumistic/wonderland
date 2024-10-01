import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(req: Request) {
  const body = await req.json(); // Parse the JSON body
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  // Find the user by email
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    console.log('User not found:', email); // Log user not found
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  // Compare the password with the hashed password in the database
  const isPasswordValid = await compare(password, user.passwordHash);
  if (!isPasswordValid) {
    console.log('Invalid password for user:', email); // Log invalid password
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  // If login is successful, return a success message
  console.log('Login successful for user:', email); // Log successful login
  return NextResponse.json({ message: 'Login successful', user: { id: user._id, email: user.email, role: user.role } }, { status: 200 });
}