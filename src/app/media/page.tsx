import { db } from "@/db";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import { Play, Newspaper, Image as ImageIcon, MessageSquare } from "lucide-react";

export default async function MediaPage() {
  const allMedia = await db.query.media.findMany({
    orderBy: [desc(media.createdAt)],
  });

  const categories = [
    { name: "All", icon: null },
    { name: "News", icon: <Newspaper size={16} /> },
    { name: "Highlights", icon: <Play size={16} /> },
    { name: "Photos", icon: <ImageIcon size={16} /> },
    { name: "Interviews", icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Media Centre</h1>
        <p className="text-slate-500 font-medium text-lg">The latest stories, highlights and exclusive content from Rx LIVE.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button 
            key={cat.name} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
              cat.name === "All" ? "bg-red-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allMedia.length > 0 ? (
          allMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100 flex flex-col">
              <div className="h-56 bg-slate-900 relative overflow-hidden">
                {item.mediaUrl ? (
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <Play size={64} className="opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {item.type}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <span>{format(new Date(item.createdAt), 'MMMM d, yyyy')}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>5 min read</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                  {item.content}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs">
                      A
                    </div>
                    <span className="text-xs font-bold text-slate-700">Admin Team</span>
                  </div>
                  <button className="text-blue-600 font-bold text-xs hover:underline">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Newspaper size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-400">No media found</h3>
            <p className="text-slate-500">Our media team is currently preparing fresh content for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
