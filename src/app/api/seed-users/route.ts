import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    // Create test users
    const testUsers = [
      {
        name: "Admin User",
        email: "admin@rx-live.com",
        password: await hashPassword("admin123"),
        role: "admin" as const,
      },
      {
        name: "Team Owner",
        email: "owner@rx-live.com",
        password: await hashPassword("owner123"),
        role: "team_owner" as const,
      },
      {
        name: "Media User",
        email: "media@rx-live.com",
        password: await hashPassword("media123"),
        role: "media" as const,
      },
      {
        name: "Fan User",
        email: "fan@rx-live.com",
        password: await hashPassword("fan123"),
        role: "fan" as const,
      },
    ];

    // Insert users (ignore if already exist)
    for (const user of testUsers) {
      await db.insert(users)
        .values(user)
        .onConflictDoNothing({ target: users.email })
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: "Test users created!",
      users: testUsers.map(u => ({ email: u.email, role: u.role })),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed users' }, { status: 500 });
  }
}
