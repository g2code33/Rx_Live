import { db } from "@/db";
import { teams, players, matches } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { Users, Trophy, Star, MapPin } from "lucide-react";
import { format } from "date-fns";

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const teamId = parseInt(params.id);

  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });

  if (!team) return <div className="p-24 text-center">Team not found</div>;

  const teamPlayers = await db.query.players.findMany({
    where: eq(players.teamId, teamId),
  });

  const recentMatches = await db.query.matches.findMany({
    where: or(eq(matches.homeTeamId, teamId), eq(matches.awayTeamId, teamId)),
    limit: 5,
    orderBy: [desc(matches.startTime)],
    with: {
      homeTeam: true,
      awayTeam: true,
    }
  });

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Team Header */}
      <div className="bg-gradient-to-b from-brand-surface to-brand-bg pt-24 pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-48 md:h-48 glass rounded-3xl shadow-2xl flex items-center justify-center text-5xl font-black text-white border-8 border-white/10">
              {team.shortName || team.name[0]}
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-green/30">
                  {team.country || "Ghana"}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">{team.name}</h1>
              <p className="text-white/40 font-bold flex items-center justify-center md:justify-start gap-2">
                <Star className="text-yellow-500" size={18} /> {team.city || "Ghana"} • Est. 2024
              </p>
            </div>
            <div className="md:ml-auto flex gap-4">
              <button className="glass px-6 py-3 rounded-xl font-black text-sm hover:bg-white/10 transition-all uppercase tracking-widest">Follow Club</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Squad List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8 border border-white/5">
              <h3 className="text-2xl font-black italic mb-8 uppercase flex items-center gap-2">
                <Users className="text-brand-green" /> Current Squad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-4 p-4 glass-light rounded-2xl border border-white/5 hover:border-brand-green/30 transition-all group">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-white/40 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      {player.number}
                    </div>
                    <div>
                      <p className="font-bold text-white">{player.name}</p>
                      <p className="text-xs font-black text-white/20 uppercase">{player.position}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-xs font-black text-brand-green bg-brand-green/10 px-2 py-1 rounded">
                        {player.rating?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                {teamPlayers.length === 0 && <p className="text-white/20 italic">No players registered.</p>}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border border-white/5">
              <h3 className="text-2xl font-black italic mb-8 uppercase">Club Info</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-white/20 mb-1">Venue</p>
                  <p className="font-bold">{team.venue || "TBD"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/20 mb-1">City</p>
                  <p className="font-bold">{team.city || "Ghana"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/20 mb-1">Coach</p>
                  <p className="font-bold">{team.coach || "TBD"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/20 mb-1">Founded</p>
                  <p className="font-bold">2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="space-y-8">
            <div className="glass rounded-3xl p-8 border border-white/5">
              <h4 className="text-xl font-black italic mb-6 uppercase flex items-center gap-2">
                <Trophy className="text-brand-blue" /> Recent Form
              </h4>
              <div className="space-y-4">
                {recentMatches.map((m) => (
                  <div key={m.id} className="flex flex-col gap-2 p-4 glass-light rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                      <span>{format(new Date(m.startTime), 'MMM d')}</span>
                      <span className={m.status === 'live' ? 'text-brand-green' : ''}>{m.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${m.homeTeamId === teamId ? 'text-brand-green' : 'text-white/60'}`}>
                        {m.homeTeam.shortName || m.homeTeam.name}
                      </span>
                      <div className="bg-white/5 px-3 py-1 rounded font-black text-xs min-w-[50px] text-center">
                        {m.homeScore} - {m.awayScore}
                      </div>
                      <span className={`font-bold text-sm ${m.awayTeamId === teamId ? 'text-brand-green' : 'text-white/60'}`}>
                        {m.awayTeam.shortName || m.awayTeam.name}
                      </span>
                    </div>
                  </div>
                ))}
                {recentMatches.length === 0 && <p className="text-white/20 italic text-sm">No recent matches.</p>}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-green/20 to-brand-blue/20 rounded-3xl p-8 border border-white/5">
              <h4 className="text-xl font-black italic mb-2 uppercase">Fan Zone</h4>
              <p className="text-white/40 text-sm mb-6">Join the official fan club and get exclusive updates.</p>
              <button className="w-full bg-brand-green text-black py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-white transition-all">Join Club</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
