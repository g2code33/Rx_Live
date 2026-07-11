import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teams } from '@/db/schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// GET all teams
export async function GET() {
  try {
    const allTeams = await db.query.teams.findMany({
      orderBy: (teams, { asc }) => asc(teams.name),
    });
    return NextResponse.json({ teams: allTeams });
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// POST create team
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const cookieStore = await cookies();
    const token = cookieStore.get('rx_token')?.value;
    const payload = token ? verifyToken(token) : null;
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, shortName, code, city, venue, coach, primaryColor, secondaryColor } = body;

    if (!name) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }

    const [newTeam] = await db.insert(teams).values({
      name,
      shortName: shortName || name.substring(0, 2).toUpperCase(),
      code: code || name.substring(0, 3).toUpperCase(),
      city,
      venue,
      coach,
      primaryColor: primaryColor || '#1e3a8a',
      secondaryColor: secondaryColor || '#ffffff',
      country: 'Ghana',
      countryFlag: '🇬🇭',
    }).returning();

    return NextResponse.json({ success: true, team: newTeam });
  } catch (error) {
    console.error('Failed to create team:', error);
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}
