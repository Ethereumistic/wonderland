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
        token: body.token,
    }); // Log incoming request without the password

    const { email, password, firstName, lastName, token } = body;

    // Check for required fields
    if (!email || !password || !firstName || !lastName || !token) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Validate the token
    const link = await db.collection('registrationLinks').findOne({ token });

    if (!link || link.expiresAt < new Date()) {
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

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
        role: link.role, // Assign the role from the token
        firstName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // If user is a student, create a student record
    if (link.role === 'student') {
        await db.collection('students').insertOne({
            userId: result.insertedId,
            firstName,
            lastName,
            grade: [],
            class: '',
            parentIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Remove the used token
    await db.collection('registrationLinks').deleteOne({ token });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}