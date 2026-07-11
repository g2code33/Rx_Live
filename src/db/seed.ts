import { db } from "@/db";
import { competitions, seasons, teams, teamSeasons, players, users, matches, media, settings } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { addDays, subDays } from "date-fns";

export async function seed() {
  // Create Admin
  const hashedAdminPassword = await hashPassword("admin123");
  const adminResult = await db.insert(users).values({
    name: "Admin User",
    email: "admin@rx-live.com",
    password: hashedAdminPassword,
    role: "admin",
  }).onConflictDoNothing().returning();
  const admin = Array.isArray(adminResult) ? adminResult[0] : adminResult;

  // Create Competition
  const [comp] = await db.insert(competitions).values({
    name: "Rx Premier League",
    type: "league",
    country: "Ghana",
    countryFlag: "🇬🇭",
  }).returning();

  const [season] = await db.insert(seasons).values({
    competitionId: comp.id,
    name: "2024/25",
    year: "2024",
    status: "active",
  }).returning();

  // Create Teams
  const teamsData = [
    { name: "Accra Lions", shortName: "AL", code: "ACL", city: "Accra" },
    { name: "Kumasi Warriors", shortName: "KW", code: "KUW", city: "Kumasi" },
    { name: "Coastal United", shortName: "CU", code: "COU", city: "Takoradi" },
    { name: "Northern Stars", shortName: "NS", code: "NOS", city: "Tamale" },
  ];

  const createdTeams = [];
  for (const t of teamsData) {
    const [team] = await db.insert(teams).values({
      name: t.name,
      shortName: t.shortName,
      code: t.code,
      city: t.city,
      country: "Ghana",
      countryFlag: "🇬🇭",
      venue: `${t.name} Stadium`,
      primaryColor: "#1e3a8a",
      secondaryColor: "#ffffff",
    }).returning();
    createdTeams.push(team);
    
    await db.insert(teamSeasons).values({
      teamId: team.id,
      seasonId: season.id,
      group: "A",
    });

    // Add players
    const playerPositions = ["GK", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD"] as const;
    for (let i = 0; i < 5; i++) {
      await db.insert(players).values({
        teamId: team.id,
        name: `${t.shortName} Player ${i + 1}`,
        firstName: `${t.shortName}`,
        lastName: `Player ${i + 1}`,
        number: i + 1,
        position: playerPositions[i],
        nationality: "Ghana",
        countryFlag: "🇬🇭",
        rating: 6.5 + (Math.random() * 2),
      });
    }
  }

  // Create Matches
  const [t1, t2, t3, t4] = createdTeams;
  
  await db.insert(matches).values([
    {
      seasonId: season.id,
      homeTeamId: t1.id,
      awayTeamId: t2.id,
      homeScore: 2,
      awayScore: 1,
      status: "finished",
      startTime: subDays(new Date(), 2),
      venue: "Accra Sports Stadium",
      city: "Accra",
      round: "Matchday 1",
      attendance: 22000,
      referee: "Bakary Gassama",
      weather: "Clear",
      temperature: 28,
      homeOdds: 2.10,
      drawOdds: 3.20,
      awayOdds: 3.50,
    },
    {
      seasonId: season.id,
      homeTeamId: t3.id,
      awayTeamId: t4.id,
      homeScore: 0,
      awayScore: 0,
      status: "finished",
      startTime: subDays(new Date(), 1),
      venue: "Baba Yara Stadium",
      city: "Kumasi",
      round: "Matchday 1",
    },
    {
      seasonId: season.id,
      homeTeamId: t2.id,
      awayTeamId: t3.id,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      startTime: addDays(new Date(), 2),
      venue: "Accra Sports Stadium",
      city: "Accra",
      round: "Matchday 2",
      homeOdds: 1.85,
      drawOdds: 3.40,
      awayOdds: 4.20,
    },
    {
      seasonId: season.id,
      homeTeamId: t4.id,
      awayTeamId: t1.id,
      homeScore: 1,
      awayScore: 1,
      status: "live",
      startTime: new Date(),
      venue: "Tamale Stadium",
      city: "Tamale",
      round: "Matchday 2",
      isLive: true,
      minute: 67,
      period: "2H",
    },
  ]);

  // Create Media
  await db.insert(media).values([
    {
      type: "news",
      title: "Lions Roar to Victory in Season Opener",
      content: "Accra Lions secured a hard-fought 2-1 victory against Kumasi Warriors.",
      authorId: admin.id,
      mediaUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
    },
    {
      type: "highlight",
      title: "Match Highlights: Stars vs United",
      content: "Watch the best moments from the goalless draw.",
      authorId: admin.id,
      mediaUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      isPublished: true,
    },
  ]);

  // Create Settings
  await db.insert(settings).values([
    { key: "app_name", value: "Rx Live", type: "string", description: "Application name" },
    { key: "match_duration", value: "90", type: "string", description: "Default match duration" },
  ]);

  console.log("Seeding completed successfully!");
  return { admin, comp, season, teams: createdTeams };
}
