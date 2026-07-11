"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, ShieldCheck, Timer, ChevronRight, Lock } from "lucide-react";

export default function BallotDrawPage() {
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedGroup, setRevealedGroup] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMyTurn, setIsMyTurn] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && isMyTurn && !selectedBall) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedBall) {
      handleBallClick(Math.floor(Math.random() * 5));
    }
  }, [timeLeft, isMyTurn, selectedBall]);

  const handleBallClick = (index: number) => {
    if (selectedBall !== null || !isMyTurn) return;
    
    setSelectedBall(index);
    setIsRevealing(true);
    
    // Simulate ball opening animation delay
    setTimeout(() => {
      const groups = ["GROUP A", "GROUP B", "GROUP C", "GROUP D"];
      const randomGroup = groups[Math.floor(Math.random() * groups.length)];
      setRevealedGroup(randomGroup);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#39FF14", "#2196F3", "#FFFFFF"]
      });
      
      setIsRevealing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-bg pt-12 pb-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-green/30">
                Official Ceremony
              </span>
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                <Timer size={14} />
                Live from Accra
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Ballot Draw <span className="text-brand-green">Ceremony</span>
            </h1>
          </div>

          <div className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 min-w-[300px]">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isMyTurn ? "gradient-green" : "bg-white/5"}`}>
               {isMyTurn ? <ShieldCheck className="text-black" /> : <Lock className="text-white/20" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Owner Status</p>
              <p className={`text-sm font-black uppercase italic ${isMyTurn ? "text-brand-green" : "text-white/20"}`}>
                {isMyTurn ? "Your Turn to Pick" : "Waiting for Next"}
              </p>
              {isMyTurn && !selectedBall && (
                <div className="flex items-center gap-2 mt-1">
                   <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${(timeLeft/30)*100}%`, transition: 'width 1s linear' }}
                        className="h-full bg-brand-red"
                      />
                   </div>
                   <span className="text-[10px] font-black text-brand-red">{timeLeft}s</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Action Area */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[500px] glass rounded-[3rem] p-12 relative overflow-hidden border border-white/5 shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none"></div>

            {revealedGroup ? (
              <div 
                className="text-center space-y-8 z-10 animate-in fade-in zoom-in duration-700"
              >
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-[0.5em] text-white/40">Selection Result</p>
                  <h2 
                     className="text-7xl md:text-9xl font-black italic text-brand-green text-glow-green tracking-widest transition-all duration-1000"
                  >
                    {revealedGroup}
                  </h2>
                </div>
                <div className="flex flex-col items-center gap-6">
                   <div className="w-24 h-24 gradient-green rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(57,255,20,0.5)]">
                      <Trophy size={48} className="text-black" />
                   </div>
                   <p className="text-lg font-bold text-white max-w-xs uppercase italic tracking-tighter">
                      Your team has been placed in {revealedGroup}.
                   </p>
                   <button onClick={() => window.location.reload()} className="px-8 py-4 glass-light rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-black transition-all">
                     Continue Ceremony
                   </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 z-10">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handleBallClick(i)}
                    className={`relative cursor-pointer group transition-all duration-500 ${selectedBall !== null && selectedBall !== i ? "opacity-0 scale-50" : "opacity-100 scale-100"} ${selectedBall === i ? "pointer-events-none" : "hover:scale-110 hover:rotate-3"}`}
                  >
                    <div className={`w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center transition-all duration-500 ${isRevealing && selectedBall === i ? "animate-float" : ""}`}>
                      {/* 3D Ball Visuals */}
                      <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-green/20 transition-all"></div>
                      <div className={`w-full h-full rounded-full border-2 border-white/10 flex items-center justify-center transition-all relative overflow-hidden ${selectedBall === i ? "bg-white/10" : "glass"}`}>
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/60 to-transparent"></div>
                         <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full blur-md"></div>
                         
                         {isRevealing && selectedBall === i ? (
                           <div className="animate-spin text-brand-green">
                             <Trophy size={40} />
                           </div>
                         ) : (
                           <span className="text-2xl font-black italic text-white/20 group-hover:text-brand-green transition-colors font-sans">?</span>
                         )}
                      </div>
                    </div>
                    {selectedBall === null && (
                       <div className="mt-4 text-center">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Ball 0{i+1}</span>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Live Groups */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Live Group Standings</h3>
            <div className="space-y-4">
               {["A", "B", "C"].map((label) => (
                 <div key={label} className="glass rounded-2xl overflow-hidden border border-white/5">
                   <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                      <span className="text-xs font-black uppercase italic tracking-widest">Group {label}</span>
                      <ChevronRight size={14} className="text-white/20" />
                   </div>
                   <div className="p-4 space-y-3 min-h-[120px]">
                      {revealedGroup?.includes(label) ? (
                        <div className="flex items-center gap-3 bg-brand-green/10 p-3 rounded-xl border border-brand-green/20 animate-pulse">
                          <div className="w-8 h-8 gradient-green rounded-lg flex items-center justify-center font-black text-black text-[10px]">YOU</div>
                          <span className="text-xs font-black uppercase tracking-widest text-brand-green">Your Team Name</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                           <p className="text-[10px] font-black uppercase tracking-widest">Waiting for teams...</p>
                        </div>
                      )}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
