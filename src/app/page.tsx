import { db } from "@/db";
import { matches, teams, media } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronRight, Play, Trophy, Newspaper, Star, Timer, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function Home() {
  const liveMatches = await db.query.matches.findMany({
    where: eq(matches.status, "live"),
    with: { homeTeam: true, awayTeam: true, season: { with: { competition: true } } },
  });

  const todayMatches = await db.query.matches.findMany({
    limit: 10,
    orderBy: [desc(matches.startTime)],
    with: { homeTeam: true, awayTeam: true, season: { with: { competition: true } } },
  });

  const news = await db.query.media.findMany({
    limit: 4,
    orderBy: [desc(media.createdAt)],
  });

  return (
    <div className="flex flex-col gap-8 pt-6">
      {/* Live Now Scroller */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-green rounded-full pulse-green"></span>
            Live Now
          </h2>
          <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-1 rounded uppercase">
            {liveMatches.length} Active
          </span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <Link href={`/matches/${match.id}`} key={match.id} className="min-w-[280px] glass rounded-3xl p-5 hover:border-brand-green/30 transition-all group">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                     {(match as any).season.competition.name}
                   </span>
                   <div className="flex items-center gap-1.5 bg-brand-red/10 text-brand-red px-2 py-0.5 rounded-full text-[10px] font-black">
                     <Timer size={10} />
                     76'
                   </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <span className="text-xl">{match.homeTeam.name[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-center line-clamp-1">{match.homeTeam.name}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-black italic tracking-tighter flex items-center gap-2">
                      <span className="text-brand-green text-glow-green">{match.homeScore}</span>
                      <span className="text-white/20">-</span>
                      <span className="text-brand-green text-glow-green">{match.awayScore}</span>
                    </div>
                    <div className="text-[10px] font-black text-brand-green uppercase mt-1 tracking-widest">LIVE</div>
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <span className="text-xl">{match.awayTeam.name[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-center line-clamp-1">{match.awayTeam.name}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
             <div className="w-full glass rounded-3xl p-8 flex flex-col items-center justify-center border-dashed border-white/10 opacity-50">
               <Trophy size={32} className="mb-2 text-white/20" />
               <p className="text-sm font-bold uppercase tracking-widest text-white/30">No matches live right now</p>
             </div>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fixtures */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <div className="flex gap-6">
                <button className="text-sm font-black uppercase tracking-widest text-brand-green border-b-2 border-brand-green pb-4 -mb-[18px]">Today</button>
                <button className="text-sm font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors pb-4">Tomorrow</button>
                <button className="text-sm font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors pb-4">Finished</button>
             </div>
             <button className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
               <Calendar size={18} />
             </button>
          </div>

          <div className="space-y-3">
             {todayMatches.map((match) => (
               <Link href={`/matches/${match.id}`} key={match.id} className="block glass-light rounded-2xl p-4 hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4 w-1/3">
                      <span className="text-[10px] font-black text-white/20">{format(new Date(match.startTime), 'HH:mm')}</span>
                      <div className="w-px h-4 bg-white/10"></div>
                      <span className="text-xs font-bold text-white/60">{(match as any).season.competition.name}</span>
                   </div>
                   
                   <div className="flex items-center justify-center gap-8 flex-1">
                      <div className="flex items-center gap-3 justify-end w-32">
                        <span className="text-sm font-bold group-hover:text-brand-green transition-colors">{match.homeTeam.name}</span>
                        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black border border-white/5">
                          {match.homeTeam.shortName || match.homeTeam.name[0]}
                        </div>
                      </div>
                      
                      <div className="bg-white/5 px-3 py-1 rounded-lg min-w-[60px] text-center">
                        <span className="text-lg font-black tracking-tighter">
                          {match.status === 'scheduled' ? '-' : match.homeScore} : {match.status === 'scheduled' ? '-' : match.awayScore}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 justify-start w-32">
                        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black border border-white/5">
                          {match.awayTeam.shortName || match.awayTeam.name[0]}
                        </div>
                        <span className="text-sm font-bold group-hover:text-brand-green transition-colors">{match.awayTeam.name}</span>
                      </div>
                   </div>

                   <div className="flex justify-end w-1/4">
                      <button className="p-2 text-white/20 hover:text-brand-green transition-colors">
                        <Star size={18} />
                      </button>
                   </div>
                 </div>
               </Link>
             ))}
          </div>
        </div>

        {/* Right Column: Trending News & Top Scorers */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Latest Highlights</h3>
              <div className="space-y-4">
                {news.map((item) => (
                  <Link href={`/media`} key={item.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-24 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                      <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${item.mediaUrl})` }}></div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">{item.type}</span>
                      <h4 className="text-xs font-bold leading-tight group-hover:text-brand-green transition-colors line-clamp-2">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border border-brand-green/10 bg-gradient-to-br from-brand-green/5 to-transparent">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-green mb-6">Top Scorers</h3>
              <div className="space-y-5">
                {[
                  { name: "Iñaki Williams", goals: 12, team: "Ghana", rank: 1, color: "text-yellow-500" },
                  { name: "Mohammed Kudus", goals: 9, team: "Ghana", rank: 2, color: "text-slate-400" },
                  { name: "Jordan Ayew", goals: 7, team: "Ghana", rank: 3, color: "text-orange-400" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black ${p.color}`}>0{p.rank}</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px]">{p.name[0]}</div>
                      <div>
                        <p className="text-xs font-bold">{p.name}</p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{p.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-brand-green">{p.goals}</p>
                      <p className="text-[8px] font-black text-white/20 uppercase">Goals</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 glass-light rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-green hover:text-black transition-all">
                Full Statistics
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
