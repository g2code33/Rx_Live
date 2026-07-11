import { db } from "@/db";
import { matches } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { format } from "date-fns";
import { Trophy, Calendar, MapPin } from "lucide-react";

export default async function MatchesPage() {
  const allMatches = await db.query.matches.findMany({
    with: {
      homeTeam: true,
      awayTeam: true,
      season: {
        with: {
          competition: true
        }
      }
    },
    orderBy: [desc(matches.startTime)],
  });

  const groupedMatches = allMatches.reduce((acc, match) => {
    const date = format(new Date(match.startTime), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(match as any);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">FIXTURES & RESULTS</h1>
          <p className="text-slate-500 font-medium">Follow every match from across the Rx LIVE network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50">Filter by Competition</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-red-700">Today's Matches</button>
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date}>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-900 text-white px-4 py-1 rounded text-sm font-bold">
                {format(new Date(date), 'EEEE, MMMM d')}
              </div>
              <div className="h-px bg-slate-200 flex-grow"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {dateMatches.map((match) => (
                <div key={match.id} className="bg-white border border-slate-100 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/4 text-center md:text-left">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {match.season.competition.name}
                    </div>
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-center md:justify-start gap-1">
                      <MapPin size={12} className="text-slate-400" /> {match.venue || "Stadium TBD"}
                    </div>
                  </div>

                  <div className="flex-grow flex items-center justify-center gap-8 md:gap-12">
                    <div className="flex flex-col items-center gap-2 w-24 md:w-32">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full mb-1"></div>
                      <span className="font-bold text-center text-sm md:text-base">{match.homeTeam.name}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-2xl md:text-3xl flex items-center gap-4">
                        <span>{match.status === 'scheduled' ? '-' : match.homeScore}</span>
                        <span className="text-slate-500 text-sm font-bold">:</span>
                        <span>{match.status === 'scheduled' ? '-' : match.awayScore}</span>
                      </div>
                      <div className="mt-2 text-[10px] font-black uppercase text-blue-600 tracking-tighter">
                        {match.status === 'live' ? 'LIVE' : match.status === 'finished' ? 'FINAL' : format(new Date(match.startTime), 'HH:mm')}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-24 md:w-32">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full mb-1"></div>
                      <span className="font-bold text-center text-sm md:text-base">{match.awayTeam.name}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/4 flex justify-center md:justify-end gap-2">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs transition-colors">
                      Prediction
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors">
                      Match Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedMatches).length === 0 && (
          <div className="py-24 text-center">
            <Calendar size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-400">No matches found</h3>
            <p className="text-slate-500">There are no matches scheduled for the current period.</p>
          </div>
        )}
      </div>
    </div>
  );
}
