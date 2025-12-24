import { IPlayer } from './player.interface';

export interface ICategory {
  id: number;
  categoryName: string;
  players: IPlayer[];
}
