import { db } from "@/db";
import { teams, matches, teamSeasons, seasons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Trophy, Info, ChevronRight } from "lucide-react";

export default async function StandingsPage() {
  const activeSeason = await db.query.seasons.findFirst({
    where: eq(seasons.status, "active"),
    with: { competition: true }
  });

  if (!activeSeason) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold opacity-30">No active season found</h2>
      </div>
    );
  }

  const teamsInSeason = await db.query.teamSeasons.findMany({
    where: eq(teamSeasons.seasonId, activeSeason.id),
    with: { team: true }
  });

  const seasonMatches = await db.query.matches.findMany({
    where: and(eq(matches.seasonId, activeSeason.id), eq(matches.status, "finished"))
  });

  const standings = (teamsInSeason as any[]).map((ts) => {
    const team = ts.team;
    let played = 0, won = 0, drawn = 0, lost = 0, gf = 0, ga = 0;

    (seasonMatches as any[]).forEach((m) => {
      if (m.homeTeamId === team.id) {
        played++;
        gf += m.homeScore;
        ga += m.awayScore;
        if (m.homeScore > m.awayScore) won++;
        else if (m.homeScore === m.awayScore) drawn++;
        else lost++;
      } else if (m.awayTeamId === team.id) {
        played++;
        gf += m.awayScore;
        ga += m.homeScore;
        if (m.awayScore > m.homeScore) won++;
        else if (m.awayScore === m.homeScore) drawn++;
        else lost++;
      }
    });

    return {
      name: team.name,
      played,
      won,
      drawn,
      lost,
      gf,
      ga,
      gd: gf - ga,
      points: (won * 3) + drawn
    };
  }).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
           <span className="bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-blue/30">
             FIFA Style Ranking
           </span>
           <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
             Group <span className="text-brand-blue">Standings</span>
           </h1>
           <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{(activeSeason as any).competition.name} • Season {activeSeason.name}</p>
        </div>
        
        <div className="flex gap-4">
           <div className="glass-light p-4 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-brand-green/20">
                 <Trophy size={18} className="text-black" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-white/20">Championship Prize</p>
                 <p className="text-sm font-black uppercase italic tracking-tighter">Gold Trophy + ₵50,000</p>
              </div>
           </div>
        </div>
      </div>

      <div className="glass rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                <th className="px-8 py-6">Pos</th>
                <th className="px-8 py-6">Team</th>
                <th className="px-4 py-6 text-center">P</th>
                <th className="px-4 py-6 text-center">W</th>
                <th className="px-4 py-6 text-center">D</th>
                <th className="px-4 py-6 text-center">L</th>
                <th className="px-4 py-6 text-center">GF</th>
                <th className="px-4 py-6 text-center">GA</th>
                <th className="px-4 py-6 text-center">GD</th>
                <th className="px-8 py-6 text-center bg-brand-green/10 text-brand-green">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {standings.map((row, i) => (
                <tr key={row.name} className={`hover:bg-white/[0.02] transition-colors group relative ${i < 2 ? "bg-brand-green/5" : i >= standings.length - 2 ? "bg-brand-red/5" : ""}`}>
                  <td className="px-8 py-6 relative">
                    {/* FIFA style qualification line */}
                    {i < 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green"></div>}
                    {i >= standings.length - 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red"></div>}
                    <span className={`text-lg font-black italic ${i < 2 ? "text-brand-green" : i >= standings.length - 2 ? "text-brand-red" : "text-white/20"}`}>
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-black text-xs border border-white/5 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all">
                        {row.name[0]}
                      </div>
                      <span className="font-black italic uppercase tracking-tighter text-sm group-hover:text-brand-green transition-colors">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.played}</td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.won}</td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.drawn}</td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.lost}</td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.gf}</td>
                  <td className="px-4 py-6 text-center font-bold text-xs text-white/40">{row.ga}</td>
                  <td className={`px-4 py-6 text-center font-black text-xs ${row.gd > 0 ? "text-brand-green" : row.gd < 0 ? "text-brand-red" : "text-white/20"}`}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-8 py-6 text-center font-black italic text-xl text-brand-green bg-brand-green/5">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-8 px-8 py-6 glass-light rounded-3xl border border-white/5">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-brand-green rounded-sm"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Qualified for Playoffs</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-brand-red rounded-sm"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Eliminated</span>
         </div>
         <div className="flex items-center gap-3 ml-auto">
            <Info size={14} className="text-brand-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Updated Live from Rx Data Center</span>
         </div>
      </div>
    </div>
  );
}
