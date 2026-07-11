import { pgTable, serial, text, timestamp, integer, varchar, boolean, jsonb, pgEnum, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["admin", "media", "fan", "team_owner"]);
export const matchStatusEnum = pgEnum("match_status", ["scheduled", "live", "finished", "postponed", "cancelled"]);
export const mediaTypeEnum = pgEnum("media_type", ["news", "highlight", "photo", "interview", "report"]);
export const positionEnum = pgEnum("position", ["GK", "DEF", "MID", "FWD"]);
export const tournamentTypeEnum = pgEnum("tournament_type", ["league", "knockout", "hybrid"]);

// USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("fan").notNull(),
  avatar: text("avatar"),
  teamId: integer("team_id").references(() => teams.id),
  phone: varchar("phone", { length: 20 }),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// COMPETITIONS
export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: tournamentTypeEnum("type").default("league").notNull(),
  logo: text("logo"),
  country: varchar("country", { length: 100 }),
  countryFlag: text("country_flag"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SEASONS
export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  competitionId: integer("competition_id").references(() => competitions.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  year: varchar("year", { length: 9 }),
  status: varchar("status", { length: 20 }).default("active"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
});

// TEAMS
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 10 }),
  code: varchar("code", { length: 3 }),
  logo: text("logo"),
  country: varchar("country", { length: 100 }),
  countryFlag: text("country_flag"),
  city: varchar("city", { length: 255 }),
  venue: varchar("venue", { length: 255 }),
  venueCapacity: integer("venue_capacity"),
  coach: varchar("coach", { length: 255 }),
  captain: varchar("captain", { length: 255 }),
  founded: integer("founded"),
  description: text("description"),
  primaryColor: varchar("primary_color", { length: 7 }),
  secondaryColor: varchar("secondary_color", { length: 7 }),
  followers: integer("followers").default(0),
  formation: varchar("formation", { length: 10 }), // e.g., "4-3-3"
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TEAM SEASONS
export const teamSeasons = pgTable("team_seasons", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(),
  group: varchar("group", { length: 10 }),
  played: integer("played").default(0),
  won: integer("won").default(0),
  drawn: integer("drawn").default(0),
  lost: integer("lost").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  points: integer("points").default(0),
  form: varchar("form", { length: 10 }),
});

// PLAYERS
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  number: integer("number"),
  position: positionEnum("position"),
  nationality: varchar("nationality", { length: 100 }),
  countryFlag: text("country_flag"),
  photo: text("photo"),
  rating: real("rating").default(6.5),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  isCaptain: boolean("is_captain").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MATCHES
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.id).notNull(),
  homeTeamId: integer("home_team_id").references(() => teams.id).notNull(),
  awayTeamId: integer("away_team_id").references(() => teams.id).notNull(),
  homeScore: integer("home_score").default(0).notNull(),
  awayScore: integer("away_score").default(0).notNull(),
  homeScoreHT: integer("home_score_ht").default(0),
  awayScoreHT: integer("away_score_ht").default(0),
  status: matchStatusEnum("status").default("scheduled").notNull(),
  startTime: timestamp("start_time").notNull(),
  venue: varchar("venue", { length: 255 }),
  city: varchar("city", { length: 255 }),
  round: varchar("round", { length: 50 }),
  knockoutRound: varchar("knockout_round", { length: 50 }),
  attendance: integer("attendance"),
  referee: varchar("referee", { length: 255 }),
  weather: varchar("weather", { length: 100 }),
  temperature: integer("temperature"),
  homeOdds: real("home_odds"),
  drawOdds: real("draw_odds"),
  awayOdds: real("away_odds"),
  homeFormation: varchar("home_formation", { length: 10 }),
  awayFormation: varchar("away_formation", { length: 10 }),
  isLive: boolean("is_live").default(false),
  minute: integer("minute"),
  period: varchar("period", { length: 20 }),
  createdBy: integer("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MATCH EVENTS
export const matchEvents = pgTable("match_events", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  playerId: integer("player_id").references(() => players.id),
  type: varchar("type", { length: 50 }).notNull(),
  minute: integer("minute").notNull(),
  extraTime: integer("extra_time"),
  period: varchar("period", { length: 10 }),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LINEUPS
export const lineups = pgTable("lineups", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  formation: varchar("formation", { length: 10 }),
  isConfirmed: boolean("is_confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// LINEUP PLAYERS
export const lineupPlayers = pgTable("lineup_players", {
  id: serial("id").primaryKey(),
  lineupId: integer("lineup_id").references(() => lineups.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  position: varchar("position", { length: 50 }),
  positionX: integer("position_x"),
  positionY: integer("position_y"),
  isStarter: boolean("is_starter").default(true),
  shirtNumber: integer("shirt_number"),
  rating: real("rating"),
});

// MATCH STATS
export const matchStats = pgTable("match_stats", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  possession: integer("possession"),
  shotsTotal: integer("shots_total").default(0),
  shotsOnTarget: integer("shots_on_target").default(0),
  corners: integer("corners").default(0),
  fouls: integer("fouls").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  passes: integer("passes").default(0),
  passAccuracy: integer("pass_accuracy"),
  expectedGoals: real("expected_goals"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// MEDIA
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  type: mediaTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  thumbnailUrl: text("thumbnail_url"),
  matchId: integer("match_id").references(() => matches.id),
  authorId: integer("author_id").references(() => users.id).notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// COMMENTS
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// PREDICTIONS
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  prediction: varchar("prediction", { length: 20 }).notNull(),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// FOLLOWS
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AUDIT LOGS
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: integer("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SETTINGS
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 20 }).default("string"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RELATIONS
export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, { fields: [users.teamId], references: [teams.id] }),
}));

export const seasonsRelations = relations(seasons, ({ one }) => ({
  competition: one(competitions, { fields: [seasons.competitionId], references: [competitions.id] }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  players: many(players),
  homeMatches: many(matches, { relationName: "homeTeam" }),
  awayMatches: many(matches, { relationName: "awayTeam" }),
}));

export const teamSeasonsRelations = relations(teamSeasons, ({ one }) => ({
  team: one(teams, { fields: [teamSeasons.teamId], references: [teams.id] }),
  season: one(seasons, { fields: [teamSeasons.seasonId], references: [seasons.id] }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, { fields: [players.teamId], references: [teams.id] }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  season: one(seasons, { fields: [matches.seasonId], references: [seasons.id] }),
  homeTeam: one(teams, { fields: [matches.homeTeamId], references: [teams.id], relationName: "homeTeam" }),
  awayTeam: one(teams, { fields: [matches.awayTeamId], references: [teams.id], relationName: "awayTeam" }),
  events: many(matchEvents),
}));

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matches, { fields: [matchEvents.matchId], references: [matches.id] }),
  team: one(teams, { fields: [matchEvents.teamId], references: [teams.id] }),
  player: one(players, { fields: [matchEvents.playerId], references: [players.id] }),
}));

export const lineupsRelations = relations(lineups, ({ one, many }) => ({
  match: one(matches, { fields: [lineups.matchId], references: [matches.id] }),
  team: one(teams, { fields: [lineups.teamId], references: [teams.id] }),
  players: many(lineupPlayers),
}));

export const lineupPlayersRelations = relations(lineupPlayers, ({ one }) => ({
  lineup: one(lineups, { fields: [lineupPlayers.lineupId], references: [lineups.id] }),
  player: one(players, { fields: [lineupPlayers.playerId], references: [players.id] }),
}));

export const matchStatsRelations = relations(matchStats, ({ one }) => ({
  match: one(matches, { fields: [matchStats.matchId], references: [matches.id] }),
  team: one(teams, { fields: [matchStats.teamId], references: [teams.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  author: one(users, { fields: [media.authorId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  match: one(matches, { fields: [comments.matchId], references: [matches.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));
