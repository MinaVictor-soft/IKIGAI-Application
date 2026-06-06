# IKIGAI Matches/Sports System Documentation

## Overview

The Matches/Sports System manages football matches, teams, players, and sporting events within the IKIGAI platform. It handles match scheduling, live score updates, team management, and leaderboard rankings.

## Architecture

### Database Schema

```sql
-- Teams Table
CREATE TABLE "Team" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  logo VARCHAR(500),
  color VARCHAR(7),
  description TEXT,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  goalsFor INT DEFAULT 0,
  goalsAgainst INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  
  INDEX idx_team_active (isActive),
  INDEX idx_team_name (name)
);

-- Players Table
CREATE TABLE "Player" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE,
  teamId UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  position ENUM ('GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'SUBSTITUTE'),
  number INT,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  yellowCards INT DEFAULT 0,
  redCards INT DEFAULT 0,
  minutesPlayed INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  
  FOREIGN KEY (userId) REFERENCES "User"(id),
  FOREIGN KEY (teamId) REFERENCES "Team"(id) ON DELETE CASCADE,
  
  INDEX idx_player_teamid (teamId),
  INDEX idx_player_userid (userId)
);

-- Matches Table
CREATE TABLE "Match" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homeTeamId UUID NOT NULL,
  awayTeamId UUID NOT NULL,
  scheduledAt TIMESTAMP NOT NULL,
  startedAt TIMESTAMP,
  endedAt TIMESTAMP,
  homeTeamScore INT DEFAULT 0,
  awayTeamScore INT DEFAULT 0,
  status ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
  venue VARCHAR(255),
  referee VARCHAR(255),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (homeTeamId) REFERENCES "Team"(id) ON DELETE CASCADE,
  FOREIGN KEY (awayTeamId) REFERENCES "Team"(id) ON DELETE CASCADE,
  
  INDEX idx_match_status (status),
  INDEX idx_match_scheduled (scheduledAt),
  INDEX idx_match_homeTeam (homeTeamId),
  INDEX idx_match_awayTeam (awayTeamId)
);

-- Match Events Table
CREATE TABLE "MatchEvent" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchId UUID NOT NULL,
  playerId UUID NOT NULL,
  eventType ENUM ('GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD', 'OWN_GOAL', 'SUBSTITUTION_IN', 'SUBSTITUTION_OUT'),
  minute INT NOT NULL,
  team ENUM ('HOME', 'AWAY') NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (matchId) REFERENCES "Match"(id) ON DELETE CASCADE,
  FOREIGN KEY (playerId) REFERENCES "Player"(id) ON DELETE CASCADE,
  
  INDEX idx_matchevent_matchid (matchId),
  INDEX idx_matchevent_playerid (playerId)
);

-- Match Statistics Table
CREATE TABLE "MatchStatistics" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchId UUID NOT NULL UNIQUE,
  homeTeamPossession FLOAT DEFAULT 0,
  awayTeamPossession FLOAT DEFAULT 0,
  homeTeamShots INT DEFAULT 0,
  awayTeamShots INT DEFAULT 0,
  homeTeamShotsOnTarget INT DEFAULT 0,
  awayTeamShotsOnTarget INT DEFAULT 0,
  homeTeamFouls INT DEFAULT 0,
  awayTeamFouls INT DEFAULT 0,
  homeTeamCorners INT DEFAULT 0,
  awayTeamCorners INT DEFAULT 0,
  
  FOREIGN KEY (matchId) REFERENCES "Match"(id) ON DELETE CASCADE
);
```

## API Endpoints

### Team Management

#### Get All Teams
```
GET /api/v1/sports/teams
Query Parameters:
  - active: boolean
  - sort: name|wins|points

Response:
{
  data: [
    {
      id: "uuid",
      name: "Team Grace",
      logo: "url",
      color: "#10B981",
      wins: 5,
      draws: 2,
      losses: 1,
      goalsFor: 24,
      goalsAgainst: 10,
      points: 17,
      isActive: true
    }
  ]
}
```

#### Create Team
```
POST /api/v1/sports/teams
Authentication: Required (Admin)

Body:
{
  name: "New Team",
  logo: "url",
  color: "#10B981",
  description: "Team description"
}

Response: 201 Created
{
  data: {
    id: "uuid",
    name: "New Team",
    color: "#10B981",
    wins: 0,
    draws: 0,
    losses: 0
  }
}
```

#### Get Team Details
```
GET /api/v1/sports/teams/:teamId

Response:
{
  data: {
    id: "uuid",
    name: "Team Grace",
    logo: "url",
    color: "#10B981",
    players: [
      {
        id: "uuid",
        userId: "uuid",
        name: "John Doe",
        position: "GOALKEEPER",
        number: 1,
        goals: 0,
        assists: 0,
        minutesPlayed: 450
      }
    ],
    stats: {
      wins: 5,
      draws: 2,
      losses: 1,
      goalsFor: 24,
      goalsAgainst: 10,
      points: 17
    }
  }
}
```

#### Get Team Players
```
GET /api/v1/sports/teams/:teamId/players

Response:
{
  data: [
    {
      id: "uuid",
      userId: "uuid",
      name: "John Doe",
      position: "GOALKEEPER",
      number: 1,
      goals: 5,
      assists: 2,
      yellowCards: 1,
      redCards: 0,
      minutesPlayed: 450,
      isActive: true
    }
  ]
}
```

### Match Management

#### Get All Matches
```
GET /api/v1/sports/matches
Query Parameters:
  - status: SCHEDULED|LIVE|COMPLETED|CANCELLED
  - teamId: uuid (filter by team)
  - page: number
  - limit: number

Response:
{
  data: [
    {
      id: "uuid",
      homeTeam: { id: "uuid", name: "Team Grace", logo: "url" },
      awayTeam: { id: "uuid", name: "Team Vision", logo: "url" },
      homeTeamScore: 2,
      awayTeamScore: 1,
      status: "COMPLETED",
      scheduledAt: "2026-06-13T15:00:00Z",
      endedAt: "2026-06-13T16:45:00Z",
      venue: "Stadium",
      referee: "John Smith"
    }
  ],
  pagination: { page: 1, limit: 10, total: 25 }
}
```

#### Create Match
```
POST /api/v1/sports/matches
Authentication: Required (Admin)

Body:
{
  homeTeamId: "uuid",
  awayTeamId: "uuid",
  scheduledAt: "2026-06-20T15:00:00Z",
  venue: "Stadium Name",
  referee: "Referee Name"
}

Response: 201 Created
{
  data: {
    id: "uuid",
    homeTeam: { id: "uuid", name: "Team Grace" },
    awayTeam: { id: "uuid", name: "Team Vision" },
    status: "SCHEDULED",
    scheduledAt: "2026-06-20T15:00:00Z"
  }
}
```

#### Get Match Details
```
GET /api/v1/sports/matches/:matchId

Response:
{
  data: {
    id: "uuid",
    homeTeam: { id: "uuid", name: "Team Grace", logo: "url" },
    awayTeam: { id: "uuid", name: "Team Vision", logo: "url" },
    homeTeamScore: 2,
    awayTeamScore: 1,
    status: "COMPLETED",
    scheduledAt: "2026-06-13T15:00:00Z",
    startedAt: "2026-06-13T15:05:00Z",
    endedAt: "2026-06-13T16:45:00Z",
    venue: "Stadium",
    referee: "John Smith",
    events: [
      {
        id: "uuid",
        minute: 15,
        team: "HOME",
        eventType: "GOAL",
        player: { id: "uuid", name: "John Doe" },
        description: "Goal from open play"
      }
    ],
    statistics: {
      homeTeamPossession: 55,
      awayTeamPossession: 45,
      homeTeamShots: 12,
      awayTeamShots: 8,
      homeTeamShotsOnTarget: 6,
      awayTeamShotsOnTarget: 4
    }
  }
}
```

#### Start Match
```
POST /api/v1/sports/matches/:matchId/start
Authentication: Required (Admin)

Response: 200 OK
{
  data: {
    id: "uuid",
    status: "LIVE",
    startedAt: "2026-06-13T15:05:00Z"
  }
}
```

#### Record Match Event
```
POST /api/v1/sports/matches/:matchId/events
Authentication: Required (Admin)

Body:
{
  playerId: "uuid",
  team: "HOME",
  eventType: "GOAL",
  minute: 25,
  description: "Header from corner kick"
}

Response: 201 Created
{
  data: {
    id: "uuid",
    matchId: "uuid",
    playerId: "uuid",
    minute: 25,
    eventType: "GOAL",
    team: "HOME"
  }
}
```

#### Complete Match
```
POST /api/v1/sports/matches/:matchId/complete
Authentication: Required (Admin)

Body:
{
  homeTeamScore: 2,
  awayTeamScore: 1,
  statistics: {
    homeTeamPossession: 55,
    awayTeamPossession: 45,
    homeTeamShots: 12,
    awayTeamShots: 8
  }
}

Response: 200 OK
{
  data: {
    id: "uuid",
    status: "COMPLETED",
    homeTeamScore: 2,
    awayTeamScore: 1,
    endedAt: "2026-06-13T16:45:00Z"
  }
}
```

### Standings & Leaderboard

#### Get Standings
```
GET /api/v1/sports/standings

Response:
{
  data: [
    {
      rank: 1,
      teamId: "uuid",
      team: { id: "uuid", name: "Team Grace", logo: "url", color: "#10B981" },
      played: 8,
      won: 5,
      drawn: 2,
      lost: 1,
      goalsFor: 24,
      goalsAgainst: 10,
      goalDifference: 14,
      points: 17
    }
  ]
}
```

#### Get Team Statistics
```
GET /api/v1/sports/teams/:teamId/statistics

Response:
{
  data: {
    teamId: "uuid",
    teamName: "Team Grace",
    matches: {
      played: 8,
      won: 5,
      drawn: 2,
      lost: 1
    },
    goals: {
      for: 24,
      against: 10,
      difference: 14,
      avgPerMatch: 3.0
    },
    players: {
      topScorer: { name: "John Doe", goals: 8 },
      topAssister: { name: "Jane Smith", assists: 5 }
    },
    form: "WWDWL"
  }
}
```

## Match Status Workflow

```
SCHEDULED → LIVE → COMPLETED
                 ↘ CANCELLED
```

### Status Transitions

1. **SCHEDULED**: Match is created and waiting for kickoff
2. **LIVE**: Match has started and events are being recorded
3. **COMPLETED**: Match has ended and final score recorded
4. **CANCELLED**: Match was cancelled before/during play

## Event Types

| Type | Description | Points |
|------|-------------|--------|
| GOAL | Player scores | 3 points |
| ASSIST | Player provides assist | 1 point |
| YELLOW_CARD | Player receives warning | -0.5 points |
| RED_CARD | Player ejected | -2 points |
| OWN_GOAL | Player scores for opposition | -1 point |
| SUBSTITUTION_IN | Player enters match | 0 points |
| SUBSTITUTION_OUT | Player leaves match | 0 points |

## League Points System

- **Win**: 3 points
- **Draw**: 1 point  
- **Loss**: 0 points
- **Bonus**: +1 for clean sheet (no goals conceded)

## Service Layer

### SportsService Methods

```typescript
// Team Management
async createTeam(data: CreateTeamDTO): Promise<Team>
async getTeams(filters?: TeamFilters): Promise<Team[]>
async getTeamById(teamId: string): Promise<Team>
async updateTeam(teamId: string, data: UpdateTeamDTO): Promise<Team>
async deleteTeam(teamId: string): Promise<void>

// Player Management
async addPlayer(teamId: string, data: AddPlayerDTO): Promise<Player>
async getTeamPlayers(teamId: string): Promise<Player[]>
async updatePlayer(playerId: string, data: UpdatePlayerDTO): Promise<Player>
async removePlayer(playerId: string): Promise<void>

// Match Management
async createMatch(data: CreateMatchDTO): Promise<Match>
async getMatches(filters?: MatchFilters, pagination?: Pagination): Promise<PaginatedResponse<Match>>
async getMatchById(matchId: string): Promise<Match>
async updateMatch(matchId: string, data: UpdateMatchDTO): Promise<Match>
async startMatch(matchId: string): Promise<Match>
async completeMatch(matchId: string, data: CompleteMatchDTO): Promise<Match>
async cancelMatch(matchId: string): Promise<void>

// Match Events
async recordEvent(matchId: string, data: MatchEventDTO): Promise<MatchEvent>
async getMatchEvents(matchId: string): Promise<MatchEvent[]>

// Standings
async getStandings(): Promise<Standing[]>
async getTeamStatistics(teamId: string): Promise<TeamStatistics>
async updateStandings(): Promise<void>
```

## Notifications

### Auto-Triggered Notifications

1. **Match Created**: When admin creates new match
   - Message: "⚽ {homeTeam} vs {awayTeam} - {scheduledAt}"

2. **Match Starting**: 1 hour before kickoff
   - Message: "🔔 Match starts in 1 hour"

3. **Match Live**: When match status changes to LIVE
   - Message: "🔴 {homeTeam} vs {awayTeam} - LIVE"

4. **Goal Scored**: When goal event recorded
   - Message: "⚽ GOAL! {player} ({team}) - {score}"

5. **Match Completed**: When match ends
   - Message: "✅ FT: {homeTeam} {score} {awayTeam}"

## Admin Dashboard Features

### Match Management
- Create/Edit/Delete matches
- Set match status
- Record live events
- View match statistics
- Generate match reports

### Team Management
- Create/Edit teams
- Manage squad players
- View team statistics
- Update standings

### Standings
- Live leaderboard
- Team records
- Goal statistics
- Head-to-head records

## Usage Examples

### Creating a Match

```typescript
const matchData = {
  homeTeamId: "team1-uuid",
  awayTeamId: "team2-uuid",
  scheduledAt: new Date("2026-06-20T15:00:00Z"),
  venue: "Cairo Stadium",
  referee: "Ahmed Hassan"
};

const match = await sportsService.createMatch(matchData);
// Sends notification: ⚽ Team Grace vs Team Vision - 2026-06-20 3:00 PM
```

### Recording a Goal

```typescript
const event = await sportsService.recordEvent(matchId, {
  playerId: "player-uuid",
  team: "HOME",
  eventType: "GOAL",
  minute: 25,
  description: "Header from corner kick"
});
// Sends notification: ⚽ GOAL! John Doe (Team Grace) - 1-0
```

### Completing a Match

```typescript
const completion = await sportsService.completeMatch(matchId, {
  homeTeamScore: 2,
  awayTeamScore: 1,
  statistics: { ... }
});
// Sends notification: ✅ FT: Team Grace 2 - 1 Team Vision
// Updates standings automatically
```

## Database Indexes

```sql
CREATE INDEX idx_match_status ON "Match"(status);
CREATE INDEX idx_match_scheduled ON "Match"(scheduledAt);
CREATE INDEX idx_team_active ON "Team"(isActive);
CREATE INDEX idx_player_teamid ON "Player"(teamId);
CREATE INDEX idx_matchevent_matchid ON "MatchEvent"(matchId);
```

## Error Handling

| Error | Status | Message |
|-------|--------|---------|
| Team not found | 404 | Team does not exist |
| Match not found | 404 | Match does not exist |
| Player not found | 404 | Player does not exist |
| Invalid match status | 400 | Cannot perform action in current status |
| Same team match | 400 | Home and away teams must be different |
| Duplicate player | 400 | Player already in squad |
| Invalid event | 400 | Invalid match event type |

## Future Enhancements

- [ ] Player injuries/absences
- [ ] Substitution history
- [ ] Video highlights
- [ ] Player ratings system
- [ ] Booking system integration
- [ ] Fantasy football
- [ ] Live commentary
- [ ] Historical records
