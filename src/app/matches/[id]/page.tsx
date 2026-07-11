import { db } from "@/db";
import { matches, matchEvents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Timer, MapPin, Users, User, CloudRain, Star, Share2 } from "lucide-react";
import { format } from "date-fns";

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const matchId = parseInt(params.id);
  
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
    with: {
      homeTeam: true,
      awayTeam: true,
      events: {
        with: { player: true },
        orderBy: [desc(matchEvents.minute)]
      },
      season: { with: { competition: true } }
    }
  });

  if (!match) return <div className="p-24 text-center">Match not found</div>;

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Premium Hero Header */}
      <div className="relative h-[450px] overflow-hidden">
        {/* Background Image with Blur and Gradients */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-30" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/80 to-brand-bg"></div>
        
        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center items-center">
          <div className="flex items-center gap-4 mb-8">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
               {(match as any).season.competition.name} • {match.round}
             </span>
             <Share2 size={16} className="text-white/30 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="flex items-center justify-between w-full max-w-4xl gap-4">
             {/* Home Team */}
             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-full flex items-center justify-center border-2 border-white/5 shadow-2xl group transition-transform hover:scale-105">
                   <span className="text-4xl md:text-6xl font-black italic">{match.homeTeam.name[0]}</span>
                </div>
                <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-center">{match.homeTeam.name}</h2>
             </div>

             {/* Score / Status */}
             <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-6 md:gap-12">
                   <span className="text-7xl md:text-9xl font-black italic text-glow-green text-brand-green">{match.status === 'scheduled' ? '-' : match.homeScore}</span>
                   <span className="text-4xl md:text-6xl font-black text-white/10 italic">:</span>
                   <span className="text-7xl md:text-9xl font-black italic text-glow-green text-brand-green">{match.status === 'scheduled' ? '-' : match.awayScore}</span>
                </div>
                {match.status === 'live' ? (
                   <div className="bg-brand-green/20 text-brand-green px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest pulse-green">
                      76' LIVE
                   </div>
                ) : (
                   <div className="bg-white/5 text-white/40 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/5">
                      {match.status}
                   </div>
                )}
             </div>

             {/* Away Team */}
             <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-24 h-24 md:w-32 md:h-32 glass rounded-full flex items-center justify-center border-2 border-white/5 shadow-2xl group transition-transform hover:scale-105">
                   <span className="text-4xl md:text-6xl font-black italic">{match.awayTeam.name[0]}</span>
                </div>
                <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-center">{match.awayTeam.name}</h2>
             </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-24">
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-8 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
               {["Overview", "Timeline", "Statistics", "Lineups", "H2H"].map((tab, i) => (
                  <button key={tab} className={`text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${i === 0 ? "text-brand-green border-b-2 border-brand-green pb-4 -mb-[18px]" : "text-white/30 hover:text-white"}`}>
                    {tab}
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Match Information */}
               <div className="glass rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/30 mb-8">Match Info</h3>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20"><MapPin size={12}/> Venue</p>
                        <p className="text-xs font-bold">{match.venue}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20"><Users size={12}/> Attendance</p>
                        <p className="text-xs font-bold">45,200</p>
                     </div>
                     <div className="space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20"><User size={12}/> Referee</p>
                        <p className="text-xs font-bold">Bakary Gassama</p>
                     </div>
                     <div className="space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20"><CloudRain size={12}/> Weather</p>
                        <p className="text-xs font-bold">28°C Clear</p>
                     </div>
                  </div>
               </div>

               {/* Statistics bars */}
               <div className="glass rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/30 mb-8">Team Statistics</h3>
                  <div className="space-y-6">
                     {[
                        { label: "Possession", home: 54, away: 46 },
                        { label: "Total Shots", home: 14, away: 11 },
                        { label: "On Target", home: 6, away: 3 },
                        { label: "Corners", home: 8, away: 5 }
                     ].map((stat) => (
                        <div key={stat.label} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                              <span>{stat.home}%</span>
                              <span className="text-white/40">{stat.label}</span>
                              <span>{stat.away}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                              <div style={{ width: `${stat.home}%` }} className="bg-brand-green h-full"></div>
                              <div style={{ width: `${stat.away}%` }} className="bg-brand-blue h-full ml-auto"></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Timeline */}
            <div className="glass rounded-[3rem] p-10">
               <h3 className="text-sm font-black uppercase tracking-widest text-white/30 mb-10 flex items-center gap-3">
                  <Timer size={16} /> Match Timeline
               </h3>
               
               <div className="relative border-l border-white/5 ml-4 pl-10 space-y-12 pb-4">
                  {match.events.length > 0 ? (
                    match.events.map((event) => (
                      <div key={event.id} className="relative group">
                         {/* Icon Dot */}
                         <div className="absolute -left-[53px] top-0 w-6 h-6 rounded-full glass border-2 border-brand-green flex items-center justify-center z-10 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                            <Star size={12} className="text-brand-green fill-brand-green" />
                         </div>
                         
                         <div className="flex items-center gap-6">
                            <span className="text-lg font-black italic text-brand-green">{event.minute}'</span>
                            <div className="glass-light px-5 py-3 rounded-2xl border border-white/5 hover:border-brand-green/30 transition-all">
                               <p className="text-xs font-black uppercase tracking-widest mb-1 text-white/40">{event.type}</p>
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-[10px]">{ (event as any).player?.name[0]}</div>
                                  <span className="text-sm font-bold">{(event as any).player?.name}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/20 italic text-sm">Waiting for match updates...</p>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
