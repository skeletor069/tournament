import { ITeam } from './team.interface';

export interface IMatch {
  home: ITeam;
  homeScore?: number;
  homeWon?: boolean;
  away: ITeam;
  awayScore?: number;
  awayWon?: boolean;
}
