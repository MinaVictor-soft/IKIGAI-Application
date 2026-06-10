import { Router, Request, Response } from 'express';
import { auth } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { tournamentService } from './tournament.service';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createTournamentSchema = z.object({
  name: z.string().min(3).max(200),
  nameAr: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  numberOfGroups: z.number().min(1).max(16),
  teamsPerGroup: z.number().min(2).max(16),
  teamsAdvancingPerGroup: z.number().min(1).max(5),
  pointsForWin: z.number().default(3),
  pointsForDraw: z.number().default(1),
  pointsForLoss: z.number().default(0),
  groupStageWinXp: z.number().default(20),
  groupStageDrawXp: z.number().default(10),
  groupStageLossXp: z.number().default(5),
  quarterFinalWinXp: z.number().default(30),
  quarterFinalLossXp: z.number().default(15),
  semiFinalWinXp: z.number().default(40),
  semiFinalLossXp: z.number().default(20),
  finalWinnerXp: z.number().default(100),
  finalRunnerUpXp: z.number().default(50),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const assignGroupsSchema = z.object({
  groupAssignments: z.record(z.array(z.string().uuid())),
});

const completeMatchSchema = z.object({
  homeScore: z.number().min(0).max(50),
  awayScore: z.number().min(0).max(50),
});

// ============ CREATE TOURNAMENT ============
router.post(
  '/',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(createTournamentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const tournament = await tournamentService.createTournament({
      ...req.body,
      createdBy: req.userId,
    });

    res.status(201).json({
      data: tournament,
      message: 'Tournament created successfully',
    });
  })
);

// ============ LIST TOURNAMENTS ============
router.get(
  '/',
  auth(),
  asyncHandler(async (req: Request, res: Response) => {
    const tournaments = await tournamentService.getTournaments();
    res.json({ data: tournaments });
  })
);

// ============ GET TOURNAMENT DETAILS ============
router.get(
  '/:id',
  auth(),
  asyncHandler(async (req: Request, res: Response) => {
    const tournament = await tournamentService.getTournamentDetails(req.params.id);
    res.json({ data: tournament });
  })
);

// ============ UPDATE TOURNAMENT CONFIG ============
router.patch(
  '/:id/config',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(createTournamentSchema.partial()),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await tournamentService.updateTournament(req.params.id, req.body);
    res.json({
      data: updated,
      message: 'Tournament updated successfully',
    });
  })
);

// ============ ASSIGN TEAMS TO GROUPS ============
router.post(
  '/:id/assign-groups',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(assignGroupsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const groups = await tournamentService.assignTeamsToGroups(
      req.params.id,
      req.body.groupAssignments
    );

    res.json({
      data: groups,
      message: 'Teams assigned to groups successfully',
    });
  })
);

// ============ GENERATE GROUP STAGE MATCHES ============
router.post(
  '/:id/generate-matches',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(async (req: Request, res: Response) => {
    const matches = await tournamentService.generateGroupMatches(req.params.id);

    res.json({
      data: { matchesGenerated: matches.length },
      message: `${matches.length} matches generated for group stage`,
    });
  })
);

// ============ GET GROUP STANDINGS ============
router.get(
  '/:id/standings',
  auth(),
  asyncHandler(async (req: Request, res: Response) => {
    const standings = await tournamentService.getGroupStandings(req.params.id);
    res.json({ data: standings });
  })
);

// ============ COMPLETE TOURNAMENT MATCH ============
router.post(
  '/:tournamentId/match/:matchId/complete',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(completeMatchSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const match = await tournamentService.completeMatch(
      req.params.matchId,
      req.body.homeScore,
      req.body.awayScore
    );

    res.json({
      data: match,
      message: 'Match completed successfully',
    });
  })
);

// ============ ADVANCE TO KNOCKOUT ============
router.post(
  '/:id/advance-knockout',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(async (req: Request, res: Response) => {
    const qualified = await tournamentService.advanceToKnockout(req.params.id);

    res.json({
      data: { qualifiedTeams: qualified.length },
      message: `${qualified.length} teams qualified for knockout stage`,
    });
  })
);

// ============ GET KNOCKOUT BRACKET ============
router.get(
  '/:id/bracket',
  auth(),
  asyncHandler(async (req: Request, res: Response) => {
    const bracket = await tournamentService.getKnockoutBracket(req.params.id);
    res.json({ data: bracket });
  })
);

// ============ GET TOURNAMENT LEADERBOARD ============
router.get(
  '/:id/leaderboard',
  auth(),
  asyncHandler(async (req: Request, res: Response) => {
    const leaderboard = await tournamentService.getTournamentLeaderboard(req.params.id);
    res.json({ data: leaderboard });
  })
);

// ============ COMPLETE TOURNAMENT ============
router.post(
  '/:id/complete',
  auth(),
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(async (req: Request, res: Response) => {
    const tournament = await tournamentService.completeTournament(req.params.id);
    res.json({
      data: tournament,
      message: 'Tournament completed',
    });
  })
);

export default router;
