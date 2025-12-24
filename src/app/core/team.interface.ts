import { IPlayer } from './player.interface';

export interface ITeam {
  id: number;
  players: IPlayer[];
  groupPoints?: number;
}
