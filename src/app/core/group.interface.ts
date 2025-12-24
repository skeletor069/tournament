import { IMatch } from './match.interface';
import { ITeam } from './team.interface';

export interface IGroup {
  id: number;
  name: string;
  teams: ITeam[];
  groupMatches?: IMatch[];
}
