import { Component, Input } from '@angular/core';
import { IGroup } from '../core/group.interface';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-points-table',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './points-table.component.html',
  styleUrl: './points-table.component.scss',
})
export class PointsTableComponent {
  @Input()
  group?: IGroup;

  getTeamsSortedList() {
    if (!this.group) return [];

    return this.group.teams.sort((a, b) => {
      return (a.groupPoints ?? 0) - (b.groupPoints ?? 0);
    });
  }
}
