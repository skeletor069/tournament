import { ICategory } from './category.interface';
import { IGroup } from './group.interface';

export interface ITournament {
  id: number;
  name: string;
  categories: ICategory[];
  groups: IGroup[];
  gameStarted?: boolean;
}
