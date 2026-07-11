import { NextResponse } from 'next/server';
import { db } from '@/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// GET team for logged-in owner
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('rx_token')?.value;
    const payload = token ? verifyToken(token) : null;
    
    if (!payload || !['admin', 'team_owner'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, payload.userId),
    });

    if (!user?.teamId) {
      return NextResponse.json({ error: 'No team assigned' }, { status: 404 });
    }

    const team = await db.query.teams.findFirst({
      where: (teams, { eq }) => eq(teams.id, user.teamId),
      with: {
        players: true,
      },
    });

    return NextResponse.json({ team, user });
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
