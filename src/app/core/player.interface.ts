export interface IPlayer {
  id: number;
  name: string;
  initialPoolId?: number;
  picked?: boolean;
  assignedToGroup?: boolean;
}
