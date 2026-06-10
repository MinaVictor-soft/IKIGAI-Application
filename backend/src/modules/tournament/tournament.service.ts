import prisma from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { xpService } from '../xp/xp.service';
import { notificationsService } from '../notifications/notifications.service';

export class TournamentService {
  // ============ CREATE TOURNAMENT ============

  async createTournament(input: any) {
    // Validate configuration
    const totalTeams = input.numberOfGroups * input.teamsPerGroup;
    if (totalTeams < 4) {
      throw new AppError(400, 'INVALID_CONFIG', 'Minimum 4 teams required');
    }

    const tournament = await prisma.tournament.create({
      data: {
        name: input.name,
        nameAr: input.nameAr,
        description: input.description,
        descriptionAr: input.descriptionAr,
        status: 'PLANNING',
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        numberOfGroups: input.numberOfGroups,
        teamsPerGroup: input.teamsPerGroup,
        teamsAdvancingPerGroup: input.teamsAdvancingPerGroup,
        pointsForWin: input.pointsForWin,
        pointsForDraw: input.pointsForDraw,
        pointsForLoss: input.pointsForLoss,
        groupStageWinXp: input.groupStageWinXp,
        groupStageDrawXp: input.groupStageDrawXp,
        groupStageLossXp: input.groupStageLossXp,
        quarterFinalWinXp: input.quarterFinalWinXp,
        quarterFinalLossXp: input.quarterFinalLossXp,
        semiFinalWinXp: input.semiFinalWinXp,
        semiFinalLossXp: input.semiFinalLossXp,
        finalWinnerXp: input.finalWinnerXp,
        finalRunnerUpXp: input.finalRunnerUpXp,
        createdBy: input.createdBy,
      },
    });

    return tournament;
  }

  // ============ ASSIGN TEAMS TO GROUPS ============

  async assignTeamsToGroups(tournamentId: string, groupAssignments: any) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');
    if (tournament.status !== 'PLANNING') {
      throw new AppError(422, 'INVALID_STATUS', 'Cannot modify groups after planning stage');
    }

    // Delete existing groups
    await prisma.tournamentGroup.deleteMany({ where: { tournamentId } });

    // Create groups and assign teams
    const groups = Object.entries(groupAssignments).map(([groupName, teamIds]: [string, any], idx) => ({
      tournamentId,
      groupName,
      displayOrder: idx,
      teams: {
        create: (teamIds as string[]).map((teamId: string) => ({
          teamId,
        })),
      },
    }));

    const result = await Promise.all(
      groups.map((group) =>
        prisma.tournamentGroup.create({
          data: {
            tournamentId: group.tournamentId,
            groupName: group.groupName,
            displayOrder: group.displayOrder,
            teams: {
              create: group.teams.create,
            },
          },
        })
      )
    );

    return result;
  }

  // ============ GENERATE GROUP STAGE MATCHES ============

  async generateGroupMatches(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        groups: {
          include: {
            teams: true,
          },
        },
      },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    // Generate round-robin matches for each group
    const matches = [];
    for (const group of tournament.groups) {
      const teamIds = group.teams.map((t) => t.teamId);

      // Round-robin algorithm
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          matches.push({
            tournamentId,
            groupId: group.id,
            stageType: 'GROUP_STAGE',
            homeTeamId: teamIds[i],
            awayTeamId: teamIds[j],
            status: 'SCHEDULED',
          });
        }
      }
    }

    // Batch create matches
    await prisma.tournamentMatch.createMany({
      data: matches,
    });

    // Update tournament status
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'GROUP_STAGE' },
    });

    return matches;
  }

  // ============ GET GROUP STANDINGS ============

  async getGroupStandings(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        groups: {
          include: {
            teams: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    // Sort teams in each group by: points → goalDifference → goalsFor
    const standings = tournament.groups.map((group) => ({
      groupName: group.groupName,
      teams: group.teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      }),
    }));

    return standings;
  }

  // ============ COMPLETE MATCH & UPDATE STANDINGS ============

  async completeMatch(matchId: string, homeScore: number, awayScore: number) {
    const match = await prisma.tournamentMatch.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true },
    });

    if (!match) throw new AppError(404, 'MATCH_NOT_FOUND', 'Match not found');

    const tournament = await prisma.tournament.findUnique({ where: { id: match.tournamentId } });
    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    // Determine result
    const homeWin = homeScore > awayScore;
    const awayWin = awayScore > homeScore;
    const draw = homeScore === awayScore;

    const result = await prisma.$transaction(async (tx) => {
      // Update match
      const updatedMatch = await tx.tournamentMatch.update({
        where: { id: matchId },
        data: {
          status: 'COMPLETED',
          homeScore,
          awayScore,
          completedAt: new Date(),
        },
      });

      // Update group standings
      if (match.groupId) {
        // Update home team
        await tx.tournamentGroupTeam.update({
          where: {
            groupId_teamId: { groupId: match.groupId, teamId: match.homeTeamId },
          },
          data: {
            matchesPlayed: { increment: 1 },
            wins: { increment: homeWin ? 1 : 0 },
            draws: { increment: draw ? 1 : 0 },
            losses: { increment: awayWin ? 1 : 0 },
            goalsFor: { increment: homeScore },
            goalsAgainst: { increment: awayScore },
            goalDifference: { increment: homeScore - awayScore },
            points: {
              increment: homeWin
                ? tournament.pointsForWin
                : draw
                ? tournament.pointsForDraw
                : tournament.pointsForLoss,
            },
          },
        });

        // Update away team
        await tx.tournamentGroupTeam.update({
          where: {
            groupId_teamId: { groupId: match.groupId, teamId: match.awayTeamId },
          },
          data: {
            matchesPlayed: { increment: 1 },
            wins: { increment: awayWin ? 1 : 0 },
            draws: { increment: draw ? 1 : 0 },
            losses: { increment: homeWin ? 1 : 0 },
            goalsFor: { increment: awayScore },
            goalsAgainst: { increment: homeScore },
            goalDifference: { increment: awayScore - homeScore },
            points: {
              increment: awayWin
                ? tournament.pointsForWin
                : draw
                ? tournament.pointsForDraw
                : tournament.pointsForLoss,
            },
          },
        });
      }

      // Award XP based on match stage and result
      const xpAmount = {
        homeTeam: homeWin
          ? tournament.groupStageWinXp
          : draw
          ? tournament.groupStageDrawXp
          : tournament.groupStageLossXp,
        awayTeam: awayWin
          ? tournament.groupStageWinXp
          : draw
          ? tournament.groupStageDrawXp
          : tournament.groupStageLossXp,
      };

      // Get all players on both teams
      const homeTeamPlayers = await tx.teamPlayer.findMany({
        where: { teamId: match.homeTeamId },
      });
      const awayTeamPlayers = await tx.teamPlayer.findMany({
        where: { teamId: match.awayTeamId },
      });

      // Award XP to all players
      for (const player of [...homeTeamPlayers, ...awayTeamPlayers]) {
        const isHomeTeam = homeTeamPlayers.some((p) => p.userId === player.userId);
        const xpAmount_ = isHomeTeam ? xpAmount.homeTeam : xpAmount.awayTeam;

        await xpService.awardXp(tx, {
          userId: player.userId,
          amount: xpAmount_,
          type: 'SPORTS',
          sourceType: 'SPORTS',
          sourceId: matchId,
          description: `Tournament: ${homeWin ? 'Win' : draw ? 'Draw' : 'Loss'}`,
        });
      }

      return updatedMatch;
    });

    return result;
  }

  // ============ ADVANCE TO KNOCKOUT ============

  async advanceToKnockout(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        groups: {
          include: {
            teams: true,
          },
        },
      },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');
    if (tournament.status !== 'GROUP_STAGE') {
      throw new AppError(422, 'INVALID_STATUS', 'Must complete group stage first');
    }

    // Collect top teams from each group
    const qualifiedTeams: any[] = [];
    for (const group of tournament.groups) {
      const sortedTeams = group.teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });

      // Mark as qualified
      for (let i = 0; i < tournament.teamsAdvancingPerGroup; i++) {
        sortedTeams[i].qualified = true;
        qualifiedTeams.push(sortedTeams[i]);
      }
    }

    // Generate knockout bracket (will be improved for seeding)
    const knockoutMatches = this.generateKnockoutBracket(qualifiedTeams, tournament);

    // Create knockout matches
    await prisma.tournamentMatch.createMany({
      data: knockoutMatches,
    });

    // Update tournament status
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'KNOCKOUT' },
    });

    return qualifiedTeams;
  }

  // ============ GENERATE KNOCKOUT BRACKET ============

  private generateKnockoutBracket(qualifiedTeams: any[], tournament: any) {
    const matches = [];

    // 8 teams → 4 quarter-finals
    if (qualifiedTeams.length >= 8) {
      for (let i = 0; i < 4; i++) {
        matches.push({
          tournamentId: tournament.id,
          stageType: 'QUARTER_FINAL',
          homeTeamId: qualifiedTeams[i * 2].teamId,
          awayTeamId: qualifiedTeams[i * 2 + 1].teamId,
          status: 'SCHEDULED',
        });
      }
    }

    // 4 teams → 2 semi-finals (will be generated after QF completion)
    // 2 teams → 1 final (will be generated after SF completion)

    return matches;
  }

  // ============ GET TOURNAMENT LEADERBOARD ============

  async getTournamentLeaderboard(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    const matches = await prisma.tournamentMatch.findMany({
      where: { tournamentId, status: 'COMPLETED' },
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
    });

    // Get top players by XP earned in this tournament
    const topPlayers = await prisma.xpTransaction.groupBy({
      by: ['userId'],
      where: {
        sourceId: { in: matches.map((m) => m.id) },
        sourceType: 'SPORTS',
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10,
    });

    return {
      tournament,
      matches,
      topPlayers,
    };
  }

  // ============ GET TOURNAMENTS LIST ============

  async getTournaments() {
    return prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        groups: { include: { teams: true } },
      },
    });
  }

  // ============ GET TOURNAMENT DETAILS ============

  async getTournamentDetails(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        groups: {
          include: {
            teams: {
              include: { team: true },
            },
          },
        },
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    return tournament;
  }

  // ============ UPDATE TOURNAMENT ============

  async updateTournament(tournamentId: string, input: any) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');
    if (tournament.status !== 'PLANNING') {
      throw new AppError(422, 'INVALID_STATUS', 'Cannot modify after planning stage');
    }

    return prisma.tournament.update({
      where: { id: tournamentId },
      data: input,
    });
  }

  // ============ GET KNOCKOUT BRACKET ============

  async getKnockoutBracket(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    const brackets = await prisma.knockoutBracket.findMany({
      where: { tournamentId },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
      orderBy: { stageType: 'asc' },
    });

    // Organize by stage
    const quarterFinals = brackets.filter((b) => b.stageType === 'QUARTER_FINAL');
    const semiFinals = brackets.filter((b) => b.stageType === 'SEMI_FINAL');
    const finals = brackets.filter((b) => b.stageType === 'FINAL');

    return {
      quarterFinals,
      semiFinals,
      finals,
    };
  }

  // ============ COMPLETE TOURNAMENT ============

  async completeTournament(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) throw new AppError(404, 'TOURNAMENT_NOT_FOUND', 'Tournament not found');

    return prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
      },
    });
  }
}

export const tournamentService = new TournamentService();
