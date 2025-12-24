import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGroup } from '../core/group.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DrawState } from '../app.component';
import { ITeam } from '../core/team.interface';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { StorageService } from '../storage.service';
import { IPlayer } from '../core/player.interface';

@Component({
  selector: 'app-group',
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent {
  @Input()
  group: IGroup | null = null;

  @Input()
  selectedGroup: IGroup | null = null;

  @Input()
  playerUnavailable = false;

  @Output()
  deleteGroup = new EventEmitter<IGroup>();

  @Output()
  dataUpdated = new EventEmitter();

  @Output()
  playerFree = new EventEmitter<IPlayer>();

  @Output()
  selectGroup = new EventEmitter<IGroup>();

  storageService = inject(StorageService);

  isGroupSelected(): boolean {
    return this.selectedGroup?.id === this.group?.id;
  }

  onDeleteGroup() {
    if (this.group) {
      console.log('Deleting group with id:', this.group.id);
      // Implement deletion logic here
      this.deleteGroup.emit(this.group);
      this.dataUpdated.emit();
    }
  }

  onSelectGroup() {
    if (this.group) {
      console.log('Selecting group with id:', this.group.id);
      // Implement selection logic here
      this.selectGroup.emit(this.group);
    }
  }

  isDrawStarted() {
    return DrawState.drawStarted;
  }

  isAnimating() {
    return DrawState.animating;
  }

  getPlayer2Name(team: ITeam) {
    if (!team || team.players.length < 2) {
      return 'YTD';
    }

    return team.players[1].name;
  }
  getPlayer1Name(team: ITeam) {
    if (!team || team.players.length < 1) {
      return 'YTD';
    }

    return team.players[0].name;
  }

  getPlayer2Css(team: ITeam) {
    if (!team || team.players.length < 2) {
      return 'ytd';
    }

    return '';
  }
  getPlayer1Css(team: ITeam) {
    if (!team || team.players.length < 1) {
      return 'ytd';
    }

    return '';
  }

  deleteTeam(team: ITeam) {
    team.players.forEach((p) => {
      p.picked = false;
      p.assignedToGroup = false;
      this.playerFree.emit(p);
    });
    this.group?.teams.splice(this.group.teams.indexOf(team), 1);
    this.dataUpdated.emit();
  }

  copyTeams(): string {
    let xcelData = '';
    this.group?.teams.forEach((team) => {
      xcelData += team.players.map((p) => p.name).join(' & ') + '\n';
    });
    return xcelData;
  }
}
