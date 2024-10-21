import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(req: Request) {
    const { role, token } = await req.json();
    const { db } = await connectToDatabase();

    // Store the token with an expiration time (24 hours)
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await db.collection('registrationLinks').insertOne({
        token,
        role,
        expiresAt: expirationDate,
    });

    return NextResponse.json({ message: 'Link generated successfully' }, { status: 201 });
}