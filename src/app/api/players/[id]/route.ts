import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { players } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// PUT update player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('rx_token')?.value;
    const payload = token ? verifyToken(token) : null;
    
    if (!payload || !['admin', 'team_owner'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await params;
    const playerId = parseInt(id);

    const [updatedPlayer] = await db.update(players)
      .set({
        name: body.name,
        firstName: body.firstName,
        lastName: body.lastName,
        number: body.number,
        position: body.position,
        photo: body.photo,
        nationality: body.nationality,
        countryFlag: body.countryFlag,
        isCaptain: body.isCaptain,
        rating: body.rating,
      })
      .where(eq(players.id, playerId))
      .returning();

    return NextResponse.json({ success: true, player: updatedPlayer });
  } catch (error) {
    console.error('Failed to update player:', error);
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
  }
}

// DELETE player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('rx_token')?.value;
    const payload = token ? verifyToken(token) : null;
    
    if (!payload || !['admin', 'team_owner'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const playerId = parseInt(id);

    await db.delete(players).where(eq(players.id, playerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete player:', error);
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}
