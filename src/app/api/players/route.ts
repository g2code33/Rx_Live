import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// GET players for team
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    
    if (!teamId) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const teamPlayers = await db.query.players.findMany({
      where: eq(players.teamId, parseInt(teamId)),
      orderBy: (players, { asc }) => asc(players.number),
    });

    return NextResponse.json({ players: teamPlayers });
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

// POST create player
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('rx_token')?.value;
    const payload = token ? verifyToken(token) : null;
    
    if (!payload || !['admin', 'team_owner'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, name, firstName, lastName, number, position, photo, nationality, countryFlag } = body;

    if (!name || !teamId) {
      return NextResponse.json({ error: 'Name and team ID required' }, { status: 400 });
    }

    const [newPlayer] = await db.insert(players).values({
      teamId: parseInt(teamId),
      name,
      firstName,
      lastName,
      number: number || 0,
      position: position || 'MID',
      photo,
      nationality: nationality || 'Ghana',
      countryFlag: countryFlag || '🇬🇭',
      rating: 6.5,
    }).returning();

    return NextResponse.json({ success: true, player: newPlayer });
  } catch (error) {
    console.error('Failed to create player:', error);
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
